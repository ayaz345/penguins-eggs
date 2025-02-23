/**
 * penguins-eggs: krill_sequence
 *
 * author: Piero Proietti
 * mail: piero.proietti@gmail.com
 *
 */

/**
 * Note: I'm using REACT here to get a TUI,
 *       via ink library https://github.com/vadimdemedes/ink
 */


/**
 * Ideally, I want to respect calamares way, remplementing the same (SEMPLIFIED) steps for CLI
 *
 *
 *  - partition:     partitions
 *  - mount:         mountFs, mountVfs
 *  - unpackfs:      unpackfs
 *  - _restore:      eggs syncfrom --rootdir /tmp/calamares-krill-root/
 *  - sources-yolk:  execCalamaresModule('sources-yolk')
 *  - machineid:     machineid
 *  - fstab:         fstab
 *  - locale         locale
 *  - keyboard:      keyboard
 *  
 * - localecfg:     localecfg
 *  - users:         users
 *  - displaymanager: autologin
 *  - networkcfg:    networkcfg
 *  - hwclock:
 *  - services-systemd:
 *  - bootloader-config: execCalamaresModule('bootloader-config')
 *  - grubcfg:       grubcfg
 *  - bootloader:    bootloaded
 *  - packages:      removeInstaller
 *  - luksbootkeyfile:
 *  - plymouthcfg;
 *  - initramfscfg:  initramfscfg
 *  - initramfs:     initramfs
 *  - removeuser:    removeuser
 *  - sources-yolk-undo: execCalamaresModule('sources-yolk-undo')
 *  - bliss clustom modules
 *  - umount:     umountVfs, this.umountFs
 */


import { IRemix, IDistro, INet } from '../interfaces/index'
import Settings from '../classes/settings'

import React from 'react';
import { render, RenderOptions } from 'ink'
import Install from '../components/install'
import Finished from '../components/finished'

import fs from 'fs'
import yaml from 'js-yaml'
import shx from 'shelljs'
import Utils from '../classes/utils'
import CliAutologin from '../lib/cli-autologin'
import Pacman from '../classes/pacman';
import { installer } from '../classes/incubation/installer'
import Xdg from '../classes/xdg';
import Distro from '../classes/distro'

import { IInstaller, IDevices, IDevice } from '../interfaces/index'
import { ICalamaresModule, ILocation, IKeyboard, IPartitions, IUsers } from '../interfaces/i-krill'
import { exec } from '../lib/utils'

// import krill modules
import partition from './modules/partition'
import { mountFs, umountFs } from './modules/mount-fs'
import { mountVfs, umountVfs } from './modules/mount-vfs'
import unpackfs from './modules/unpackfs'
import machineId from './modules/machine-id'
import fstab from './modules/fstab'
import locale from './modules/locale'
import mKeyboard from './modules/m-keyboard'
import localeCfg from './modules/locale-cfg'
// users
import addUser from './modules/add-user'
import changePassword from './modules/change-password'
// displaymanager: autologin
import networkCfg from './modules/network-cfg'
// hwclock:
// services-systemd:
// bootloader-config
import bootloaderConfig from './modules/bootloader-config'
import bootloaderConfigUbuntu from './modules/bootloader-config-ubuntu'
//
import grubcfg from './modules/grubcfg'
import bootloader from './modules/bootloader'
import packages from './modules/packages'
import removeInstallerLink from './modules/remove-installer-link'
// luksbootkeyfile:
// plymouthcfg;
import initramfsCfg from './modules/initramfs-cfg'
import initramfs from './modules/initramfs'
import delLiveUser from './modules/del-live-user'
// umount already imported

// to order in same wat
import mTimezone from './modules/m-timezone'
import umount from './modules/umount'
import mkfs from './modules/mkfs'
import hostname from './modules/hostname'
import { ReadableByteStreamController } from 'stream/web';
import { createCompilerHost } from 'typescript';

import CFS from '../classes/cfs'

/**
 * hatching: installazione o cova!!!
 */
export default class Sequence {
   public partition = partition
   // mount
   public mountFs = mountFs
   public mountVfs = mountVfs
   //
   public unpackfs = unpackfs
   public machineId = machineId
   public fstab = fstab
   public locale = locale
   public keyboard = mKeyboard
   public localeCfg = localeCfg
   // users
   public addUser = addUser
   public changePassword = changePassword
   // displaumanager: autologin
   public networkCfg = networkCfg
   // hwclock:
   // services-systemd:
   // bootloader-config
   public bootloaderConfig = bootloaderConfig
   public bootloaderConfigUbuntu = bootloaderConfigUbuntu
   //
   public grubcfg = grubcfg
   public bootloader = bootloader
   public packages = packages
   public removeInstallerLink = removeInstallerLink
   // luksbootkeyfile:
   // plymouthcfg;
   public initramfsCfg = initramfsCfg
   public initramfs = initramfs
   public delLiveUser = delLiveUser
   public umountFs = umountFs
   public umountVfs = umountVfs
   // to order in same way
   public timezone = mTimezone
   public umount = umount
   public mkfs = mkfs
   public hostname = hostname


   installer = {} as IInstaller

   installTarget = '/tmp/calamares-krill-root'

   verbose = false

   echo = {}

   efi = false

   devices = {} as IDevices

   users = {} as IUsers

   network = {} as INet

   partitions = {} as IPartitions

   language = ''

   region = ''

   zone = ''

   keyboardModel = ''

   keyboardLayout = ''

   keyboardVariant = ''

   toNull = ' > /dev/null 2>&1'

   settings = {} as Settings

   remix = {} as IRemix

   distro = {} as IDistro

   // Crypted Clone
   luksName = 'luks-eggs-data'

   luksFile = `/run/live/medium/live/${this.luksName}`

   luksDevice = `/dev/mapper/${this.luksName}`

   luksMountpoint = `/mnt`

   // Clone (Uncrypted)
   is_clone = fs.existsSync('/etc/penguins-eggs.d/is_clone')

   is_crypted_clone = fs.existsSync('/etc/penguins-eggs.d/is_crypted_clone')

   unattended = false

   nointeractive = false

   halt = false

   cliAutologin = new CliAutologin()


   /**
    * constructor
    */
   constructor(location: ILocation, keyboard: IKeyboard, partitions: IPartitions, users: IUsers, network: INet) {

      this.installer = installer()
      this.settings = new Settings()

      this.language = location.language
      this.region = location.region
      this.zone = location.zone

      this.keyboardModel = keyboard.keyboardModel
      this.keyboardLayout = keyboard.keyboardLayout
      this.keyboardVariant = keyboard.keyboardVariant

      this.network = network

      this.partitions = partitions

      this.users = users

      this.devices.efi = {} as IDevice
      this.devices.boot = {} as IDevice
      this.devices.root = {} as IDevice
      this.devices.data = {} as IDevice
      this.devices.swap = {} as IDevice

      this.distro = new Distro(this.remix)

      this.efi = fs.existsSync('/sys/firmware/efi/efivars')

   }

   /**
    * install
    * @param verbose
    * @param umount
    * @returns
    */
   async start(domain = 'local', unattended = false, nointeractive = false, halt = false, verbose = false) {

      /**
       * To let krill to work with Arch we need:
       */
      if (this.distro.familyId === 'archlinux') {
         await exec(`sudo ln -s /run/archiso/bootmnt/live/ /live`)
      }

      this.unattended = unattended
      this.nointeractive = nointeractive
      this.halt = halt

      this.verbose = verbose
      this.echo = Utils.setEcho(this.verbose)
      if (this.verbose) {
         this.toNull = ''
      }

      // start
      await this.settings.load()

      // partition
      let percent = 0.0
      let message = ""
      let isPartitioned = false

      message = "Creating partitions"
      percent = 0.03
      try {
         await redraw(<Install message={message} percent={percent} />)
         isPartitioned = await this.partition()
      } catch (error) {
         await Utils.pressKeyToExit(JSON.stringify(error))
      }

      if (isPartitioned) {

         // formatting
         message = "Formatting file system "
         percent = 0.06
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.mkfs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // mountFs
         message = "Mounting target file system "
         percent = 0.09
         try {
            redraw(<Install message={message} percent={percent} />)
            await this.mountFs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // mountVfs
         message = "Mounting on target VFS "
         percent = 0.12
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.mountVfs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // unpackfs
         message = "Unpacking filesystem "
         percent = 0.15
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.unpackfs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // dpkg-unsafe-io
         if (this.distro.familyId === 'debian') {
            message = "dpkg-unsafe-io"
            percent = 0.40
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.execCalamaresModule('dpkg-unsafe-io')
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }
         }

         // sources-yolk
         if (this.distro.familyId === 'debian') {
            message = 'sources-yolk'
            percent = 0.43
            try {
               await redraw(<Install message={message} percent={percent} spinner={true} />)
               await this.execCalamaresModule('sources-yolk')
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }
         }

         // machineid
         message = 'machineid'
         percent = 0.46
         try {
            await redraw(<Install message={message} percent={percent} spinner={true} />)
            await this.machineId()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // fstab
         message = "Creating fstab "
         percent = 0.49
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.fstab(this.partitions.installationDevice)
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         /**
          * CryptedClone exec eggs syncfrom
          */
         if (this.is_crypted_clone) {
            message = "Restore private data from crypted clone "
            if (fs.existsSync(this.luksFile)) {
               percent = 0.55
               let cmd = `eggs syncfrom --rootdir /tmp/calamares-krill-root/ --file ${this.luksFile}`
               try {
                  await redraw(<Install message={message} percent={percent} spinner={true} />)
                  await exec(cmd, Utils.setEcho(true))
                  this.is_clone = true // Adesso è un clone
               } catch (error) {
                  await Utils.pressKeyToExit(cmd)
               }
            } else {
               await Utils.pressKeyToExit(`Cannot find LUKS file ${this.luksFile}`)
            }
         }

         // networkcfg
         message = "networkcfg"
         percent = 0.61
         try {
            await this.networkCfg()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // hostname
         message = "Create hostname "
         percent = 0.64
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.hostname(domain)
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // initramfsCfg
         message = "initramfs configure"
         percent = 0.67
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.initramfsCfg(this.partitions.installationDevice)
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // initramfs
         message = "initramfs "
         percent = 0.70
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.initramfs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // dpkg-unsafe-io-undo
         if (this.distro.familyId === 'debian') {
            message = "dpkg-unsafe-io-undo"
            percent = 0.72
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.execCalamaresModule('dpkg-unsafe-io-undo')
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }
         }


         /**
          * IF NOT CLONE:
          * - locale
          * - keyboard
          * - localeCfg
          * - delLiveUser
          * - adduser
          * - autologin 
          */
         if (!this.is_clone) {
            // locale
            message = "Locale"
            percent = 0.74
            try {
               redraw(<Install message={message} percent={percent} />)
               await this.locale()
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }

            // keyboard
            message = "settings keyboard"
            percent = 0.75
            try {
               await this.keyboard()
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }

            // localeCfg
            message = "Locale Configuration"
            percent = 0.76
            try {
               await this.localeCfg()
               await exec("chroot " + this.installTarget + " locale-gen")
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }

            // delLiveUser
            message = "Remove user LIVE"
            percent = 0.75
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.delLiveUser()
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }

            // addUser
            message = "Add user"
            percent = 0.76
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.addUser(this.users.name, this.users.password, this.users.fullname, '', '', '')
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }

            // changePassword root
            message = "Add user password"
            percent = 0.77
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.changePassword('root', this.users.rootPassword)
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }

            // autologin
            if (Pacman.isInstalledGui()) {
               try {
                  message = "Autologin GUI"
                  percent = 0.78
                  if (this.users.autologin) {
                     await Xdg.autologin(await Utils.getPrimaryUser(), this.users.name, this.installTarget)
                  }
                  await redraw(<Install message={message} percent={percent} />)
               } catch (error) {
                  await Utils.pressKeyToExit(JSON.stringify(error))
               }
            }
         } // IF NOT CLONE END


         // Remove ALWAYS autologin CLI
         message = "Remove autologin CLI"
         percent = 0.80
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.cliAutologin.remove(this.installTarget)
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // bootloader-config
         message = "bootloader-config "
         percent = 0.82
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.bootloaderConfig()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // grubcfg
         message = "grubcfg "
         percent = 0.84
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.grubcfg()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // bootloader (grub-install)
         message = "bootloader "
         percent = 0.86
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.bootloader()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // sources-yolk-undo
         if (this.distro.familyId === 'debian') {
            message = "sources-yolk-undo"
            percent = 0.88
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.execCalamaresModule('sources-yolk-undo')
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }
         }

         // packages
         message = "add/remove packages"
         percent = 0.90
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.packages()
         } catch (error) {
            console.log(JSON.stringify(error))
         }

         /**
          *
          * if calamares is present: remove GUI installer link
          */
         if (await Pacman.calamaresCheck()) {
            message = "remove GUI installer link"
            percent = 0.92
            try {
               await redraw(<Install message={message} percent={percent} />)
               await this.removeInstallerLink()
            } catch (error) {
               await Utils.pressKeyToExit(JSON.stringify(error))
            }
         }

         // remove /etc/penguins_eggs.d/is_clone*
         message = "Cleanup"
         percent = 0.94
         try {
            await redraw(<Install message={message} percent={percent} />)
            await exec(`rm -f ${this.installTarget}/etc/penguins-eggs.d/is_clone`)
            await exec(`rm -f ${this.installTarget}/etc/penguins-eggs.d/is_crypted_clone`)
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         /**
          * custom final steps
          */
         const cfs = new CFS()
         const steps = cfs.steps()
         if (steps.length > 0) {
            for (const step of steps) {
               message = `running ${step}`
               percent = 0.97
               try {
                  await redraw(<Install message={message} percent={percent} />)
                  await this.execCalamaresModule(step)
               } catch (error) {
                  await Utils.pressKeyToExit(JSON.stringify(error))
               }
            }
         }

         // umountVfs
         message = "umount VFS"
         percent = 0.96
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.umountVfs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         message = "umount"
         percent = 0.98
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.umountFs()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }

         // finished
         message = "finished"
         percent = 100.0
         try {
            await redraw(<Install message={message} percent={percent} />)
            await this.finished()
         } catch (error) {
            await Utils.pressKeyToExit(JSON.stringify(error))
         }
      }
   }



   /**
    *
    */
   async execCalamaresModule(name: string) {
      const moduleName = this.installer.multiarchModules + name + '/module.desc'
      if (fs.existsSync(moduleName)) {
         const calamaresModule = yaml.load(fs.readFileSync(moduleName, 'utf8')) as ICalamaresModule
         let command = calamaresModule.command
         if (command !== '' || command !== undefined) {
            command += this.toNull
            await exec(command, this.echo)
         }
      }
   }

   /**
    * only show the result
    */
   async finished() {
      await redraw(<Finished installationDevice={this.partitions.installationDevice} hostName={this.users.hostname} userName={this.users.name} />)

      let cmd = "reboot"
      if (this.halt) {
         cmd = "poweroff"
      }

      if (this.unattended && this.nointeractive) {
         console.log(`System will ${cmd} in 5 seconds...`)
         await sleep(5000)
         await exec(cmd, { echo: true })
      } else {
         Utils.pressKeyToExit(`Press a key to ${cmd}`)
         await exec(cmd, { echo: true })
      }
   }
}

// const ifaces: string[] = fs.readdirSync('/sys/class/net/')

/**
 *
 * @param elem
 */
async function redraw(elem: JSX.Element) {
   let opt: RenderOptions = {}

   opt.patchConsole = false
   opt.debug = false
   console.clear()
   // await exec('clear', Utils.setEcho(false))
   render(elem, opt)
}

/**
 *
 * @param ms
 * @returns
 */
function sleep(ms = 0) {
   return new Promise((resolve) => {
      setTimeout(resolve, ms);
   });
}

