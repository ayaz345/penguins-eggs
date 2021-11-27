/**
 * penguins-eggs-v8
 * author: Piero Proietti
 * email: piero.proietti@gmail.com
 * license: MIT
 */

import { array2spaced, depCommon, depArch, depVersions, depInit } from '../lib/dependencies'

import fs = require('fs')
import os = require('os')
import path = require('path')
import shx = require('shelljs')
import { IRemix, IDistro } from '../interfaces'

import Utils from './utils'
import Distro from './distro'
import Settings from './settings'
import { execSync } from 'child_process'
import { IConfig } from '../interfaces'
const exec = require('../lib/utils').exec

import Debian from './family/debian'

const config_file = '/etc/penguins-eggs.d/eggs.yaml' as string
const config_tools = '/etc/penguins-eggs.d/tools.yaml' as string

/**
 * Utils: general porpourse utils
 * @remarks all the utilities
 */
export default class Pacman {
   static debs4calamares = ['calamares', 'qml-module-qtquick2', 'qml-module-qtquick-controls']

   distro = {} as IDistro

   remix = {} as IRemix

   /**
    * 
    * @returns 
    */
   static distro(): IDistro {
      const remix = {} as IRemix
      const distro = new Distro(remix)
      return distro
   }

   /**
    * check if it's installed xorg
    * @returns true if xorg is installed
    */
   static isInstalledXorg(): boolean {
      let installed = false
      if (this.distro().familyId === 'debian') {
         if (Debian.isInstalledXorg()) {
            installed = true
         }
      }
      return installed
   }

   /**
    * check if it's installed wayland
    * @returns true if wayland
    */
   static isInstalledWayland(): boolean {
      let installed = false
      if (this.distro().familyId === 'debian') {
         if (Debian.isInstalledWayland()) {
            installed = true
         }
      }
      return installed
   }

   /**
    * 
    * @returns true se GUI
    */
   static isInstalledGui(): boolean {
      return (this.isInstalledXorg() || this.isInstalledWayland())
   }

   /**
    * controlla se è operante xserver-xorg-core
    */
   static isRunningXorg(): boolean {
      return process.env.XDG_SESSION_TYPE === 'x11'

   }

   /**
    * Constrolla se è operante wayland
    */
   static isRunningWayland(): boolean {
      return process.env.XDG_SESSION_TYPE === 'wayland'
   }

   /**
    * Check if the system is GUI able
    */
   static isRunningGui(): boolean {
      return this.isRunningXorg() || this.isRunningWayland()
   }

   /**
    * Check if the system is just CLI
    */
   static isRunningCli(): boolean {
      return !this.isRunningGui()
   }



   /**
    * Crea array packages dei pacchetti da installare
    */
   static packages(remove = false, verbose = false): string[] {
      let packages: string[] = []
      if (this.distro().familyId === 'debian') {
         packages = Debian.packages(remove, verbose)
      }
      return packages
   }


   /**
    * Restituisce VERO se i prerequisiti sono installati
    */
   static async prerequisitesCheck(verbose = false): Promise<boolean> {
      let installed = true
      let packages = this.packages(false, verbose)

      if (packages.length > 0) {
         installed = false
      }
      return installed
   }

   /**
    *
    */
   static async prerequisitesInstall(verbose = true): Promise<boolean> {
      let retVal = false

      if (this.distro().familyId === 'debian') {
         retVal = await Debian.prerequisitesInstall(verbose)
      }
      return retVal
   }

   /**
    * Torna verso se calamares è installato
    */
   static async calamaresCheck(): Promise<boolean> {
      let installed = true
      if (this.distro().familyId === 'debian') {
         installed = await Debian.calamaresCheck()
      }

      return installed
   }

   /**
    * Controlla se calamares è installabile
    * @returns 
    */
   static calamaresAble(): boolean {
      const remix = {} as IRemix
      const distro = new Distro(remix)

      let result = distro.calamaresAble
      if (process.arch === 'armel' || process.arch === 'arm64') {
         result = false
      }
      return result
   }

   /**
    *
    */
   static async calamaresInstall(verbose = true): Promise<void> {
      if (this.isInstalledGui()) {
         if (this.distro().familyId === 'debian') {
            Debian.calamaresInstall(verbose)
         }
      } else {
         console.log("It's not possible to use calamares in a system without GUI")
      }

   }

   /**
   * calamaresPolicies
   */
   static async calamaresPolicies() {
      if (this.distro().familyId === 'debian') {
         await Debian.calamaresPolicies()
      }
   }

   /**
    *
    */
   static async calamaresRemove(verbose = true): Promise<boolean> {
      let retVal = false
      if (this.distro().familyId === 'debian') {
         retVal = await Debian.calamaresRemove(verbose)
      }
      return retVal
   }

   /**
    * Restituisce VERO se i file di configurazione SONO presenti
    */
   static configurationCheck(): boolean {
      const confExists = fs.existsSync(config_file)
      const listExists = fs.existsSync('/usr/local/share/penguins-eggs/exclude.list')
      return (confExists && listExists)
   }



   /**
    * Ritorna vero se machine-id è uguale
    */
   static async configurationMachineNew(verbose = false): Promise<boolean> {
      const settings = new Settings()
      await settings.load()
      const result = Utils.machineId() !== settings.config.machine_id
      if (verbose) {
         if (result) {
            console.log('configurationMachineNew: True')
         }
      }
      return result
   }

   /**
    * 
    */
   static async configurationFresh() {
      const config = {} as IConfig
      config.version = Utils.getPackageVersion()
      config.snapshot_dir = '/home/eggs'
      config.snapshot_prefix = ''
      config.snapshot_excludes = '/usr/local/share/penguins-eggs/exclude.list'
      config.snapshot_basename = 'hostname'
      config.user_opt = 'live'
      config.user_opt_passwd = 'evolution'
      config.root_passwd = 'evolution'
      config.theme = 'eggs'
      config.force_installer = true
      config.make_efi = true
      config.make_md5sum = false
      config.make_isohybrid = true
      config.compression = 'xz'
      config.ssh_pass = true
      config.timezone = 'Europe/Rome'
      config.pmount_fixed = false
      const env = process.env
      if (env.LANG !== undefined) {
         config.locales_default = env.LANG
      } else {
         config.locales_default = 'en_US.UTF-8'
      }
      if (config.locales_default === 'en_US.UTF-8') {
         config.locales = ['en_US.UTF-8']
      } else {
         config.locales = [config.locales_default, 'en_US.UTF-8']
      }

      if (!this.packageIsInstalled('calamares')) {
         config.force_installer = false
         console.log(`Due the lacks of calamares package set force_installer = false`)
      }

      if (!Utils.isUefi()) {
         config.make_efi = false
         console.log('Due the lacks of grub-efi-' + Utils.machineArch() + '-bin package set make_efi = false')
      }

      /**
       * Salvo la configurazione di eggs.yaml
       */
      config.machine_id = Utils.machineId()
      config.vmlinuz = Utils.vmlinuz()
      config.initrd_img = Utils.initrdImg()
      const settings = new Settings()
      await settings.save(config)
   }


   /**
    * Creazione del file di configurazione /etc/penguins-eggs
    */
   static async configurationInstall(links = true, verbose = true): Promise<void> {
      const confRoot = '/etc/penguins-eggs.d'
      if (!fs.existsSync(confRoot)) {
         execSync(`mkdir ${confRoot}`)
      }
      const addons = `${confRoot}/addons`
      const distros = `${confRoot}/distros`
      if (fs.existsSync(addons)) {
         execSync(`rm -rf ${addons}`)
      }
      if (fs.existsSync(distros)) {
         execSync(`rm -rf ${distros}`)
      }
      execSync(`mkdir -p ${distros}`)

      shx.ln('-s', path.resolve(__dirname, '../../addons'), addons)
      shx.cp(path.resolve(__dirname, '../../conf/README.md'), '/etc/penguins-eggs.d/')
      shx.cp(path.resolve(__dirname, '../../conf/tools.yaml'), config_tools)

      // creazione del file delle esclusioni
      shx.mkdir('-p', '/usr/local/share/penguins-eggs/')
      shx.cp(path.resolve(__dirname, '../../conf/exclude.list'), '/usr/local/share/penguins-eggs')

      await this.configurationFresh()
   }

   /**
    * Rimozione dei file di configurazione
    */
   static async configurationRemove(verbose = true): Promise<void> {
      const echo = Utils.setEcho(verbose)

      if (fs.existsSync('/etc/penguins-eggs.d')) {
         await exec('rm /etc/penguins-eggs.d -rf', echo)
      }
      if (fs.existsSync('/usr/local/share/penguins-eggs/exclude.list')) {
         await exec('rm /usr/local/share/penguins-eggs/exclude.list', echo)
      }
      if (fs.existsSync('/etc/calamares')) {
         await exec('rm /etc/calamares -rf', echo)
      }
   }

   /**
    * 
    */
   static distroTemplateCheck(): boolean {
      const versionLike = this.distro().versionLike
      return fs.existsSync(`/etc/penguins-eggs.d/distros/${versionLike}`)
   }

   /**
    * 
    */
   static async distroTemplateInstall(verbose = false) {
      if (verbose) {
         console.log('distroTemplateInstall')
      }
      const rootPen = Utils.rootPenguin()
      const versionLike = this.distro().versionLike
      if (Utils.isDebPackage()) {
         await Pacman.links4Debs(verbose)
      }
      // L = follow links è OK da source, ora il problema è copiare i link da npm o rifarli
      const cmd = `cp -rL ${rootPen}/conf/distros/${versionLike} /etc/penguins-eggs.d/distros`
      execSync(cmd)
   }

   /**
    * 
    * @param verbose 
    */
   static async autocompleteInstall(verbose = false) {
      await exec(`cp ${__dirname}/../../scripts/eggs.bash /etc/bash_completion.d/`)
      if (verbose) {
         console.log('autocomplete installed...')
      }
   }

   /**
   * Installa manPage
   */
   static async manPageInstall(verbose = false) {
      const man1Dir = '/usr/share/man/man1/'
      if (!fs.existsSync(man1Dir)) {
         exec(`mkdir ${man1Dir} -p`)
      }
      const manPage = path.resolve(__dirname, '../../manpages/doc/man/eggs.1.gz')
      if (fs.existsSync(manPage)) {
         exec(`cp ${manPage} ${man1Dir}`)
      }
      if (shx.exec('which mandb', { silent: true }).stdout.trim() !== '') {
         await exec(`mandb > /dev/null`)
         if (verbose) {
            console.log('manPage eggs installed...')
         }

      }
   }

   /**
    * 
    * @param rootPen 
    */
   static async links4Debs(verbose = false) {
      const remove = false

      /**
       * Poichè i pacchetti deb, non si portano i link
       * links4Debs in /usr/lib/penguins-eggs/config/distro
       * ricostruisce i link per TUTTE le distribuzioni
       * 
       * Dato che non utilizzo più i pacchetti npm forse, 
       * converrebbe rimuovere i vari link per semplicità
       * 
       */

      if (Utils.isDebPackage() || !Utils.isSources()) {
         const rootPen = Utils.rootPenguin()

         // Debian 10 - Buster 
         const buster = `${rootPen}/conf/distros/buster`

         // Debian 8 - jessie. Eredita grub, isolinux e locales da buster, contiene krill al posto di calamares
         const jessie = `${rootPen}/conf/distros/jessie`
         await this.ln(`${buster}/grub`, `${jessie}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${jessie}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${jessie}/locales`, remove, verbose)

         // Debian 9 - stretch. Eredita grub, isolinux, locales da buster, usa krill di jessie al posto di calamares
         const stretch = `${rootPen}/conf/distros/stretch`
         await this.ln(`${buster}/grub`, `${stretch}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${stretch}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${stretch}/locales`, remove, verbose)
         await this.ln(`${jessie}/krill`, `${stretch}/krill`, remove, verbose)

         // Debian 11 - bullseye. Eredita tutto da buster
         const bullseye = `${rootPen}/conf/distros/bullseye`
         await this.ln(`${buster}/grub`, `${bullseye}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${bullseye}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${bullseye}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares`, `${bullseye}/calamares`, remove, verbose)

         // Debian 12 - bookworm. Eredita tutto da buster
         const bookworm = `${rootPen}/conf/distros/bookworm`
         await this.ln(`${buster}/grub`, `${bookworm}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${bookworm}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${bookworm}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares`, `${bookworm}/calamares`, remove, verbose)

         // Devuan beowulf. Eredita tutto da buster
         const beowulf = `${rootPen}/conf/distros/beowulf`
         await this.ln(`${buster}/grub`, `${beowulf}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${beowulf}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${beowulf}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares`, `${beowulf}/calamares`, remove, verbose)

         // Devuan chimaera. Eredita tutto da buster
         const chimaera = `${rootPen}/conf/distros/chimaera`
         await this.ln(`${buster}/grub`, `${chimaera}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${chimaera}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${chimaera}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares`, `${chimaera}/calamares`, remove, verbose)

         // Devuan daedalus. Eredita tutto da buster
         const daedalus = `${rootPen}/conf/distros/daedalus`
         await this.ln(`${buster}/grub`, `${daedalus}/grub`, remove, verbose)
         await this.ln(`${buster}/isolinux`, `${daedalus}/isolinux`, remove, verbose)
         await this.ln(`${buster}/locales`, `${daedalus}/locales`, remove, verbose)
         await this.ln(`${buster}/calamares`, `${daedalus}/calamares`, remove, verbose)

         // Ubuntu 20.04 - focal. Eredita da buster i seguenti
         const focal = `${rootPen}/conf/distros/focal`
         await this.ln(`${buster}/grub/loopback.cfg`, `${focal}/grub/loopback.cfg`, remove, verbose)
         await this.ln(`${buster}/grub/theme.cfg`, `${focal}/grub/theme.cfg`, remove, verbose)
         await this.ln(`${buster}/isolinux/isolinux.template.cfg`, `${focal}/isolinux/isolinux.template.cfg`, remove, verbose)
         await this.ln(`${buster}/isolinux/stdmenu.template.cfg`, `${focal}/isolinux/stdmenu.template.cfg`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/remove-link`, `${focal}/calamares/calamares-modules/remove-link`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk`, `${focal}/calamares/calamares-modules/sources-yolk`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk-unmount`, `${focal}/calamares/calamares-modules/sources-yolk-unmount`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/packages.yml`, `${focal}/calamares/modules/packages.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/removeuser.yml`, `${focal}/calamares/modules/removeuser.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/unpackfs.yml`, `${focal}/calamares/modules/unpackfs.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${focal}/calamares/modules/displaymanager.yml`, remove, verbose)
         // Patch a colori
         // await this.ln(`${buster}/calamares/calamares-modules/bootloader-config`, `${focal}/calamares/calamares-modules/bootloader-config`, remove, verbose)

         // Ubuntu 18.04  - bionic. Eredita da focal grub ed isolinux, da buster i seguenti
         const bionic = `${rootPen}/conf/distros/bionic`
         await this.ln(`${focal}/grub`, `${bionic}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${bionic}/isolinux`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/remove-link`, `${bionic}/calamares/calamares-modules/remove-link`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk`, `${bionic}/calamares/calamares-modules/sources-yolk`, remove, verbose)
         await this.ln(`${buster}/calamares/calamares-modules/sources-yolk-unmount`, `${bionic}/calamares/calamares-modules/sources-yolk-unmount`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/packages.yml`, `${bionic}/calamares/modules/packages.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/removeuser.yml`, `${bionic}/calamares/modules/removeuser.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/unpackfs.yml`, `${bionic}/calamares/modules/unpackfs.yml`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${bionic}/calamares/modules/displaymanager.yml`, remove, verbose)

         // Ubuntu 20.10 groovy. Eredita da focal
         const groovy = `${rootPen}/conf/distros/groovy`
         await this.ln(`${focal}/calamares`, `${groovy}/calamares`, remove, verbose)
         await this.ln(`${focal}/grub`, `${groovy}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${groovy}/isolinux`, remove, verbose)
         await this.ln(`${focal}/locale.gen.template`, `${groovy}/locale.gen.template`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${groovy}/calamares/modules/displaymanager.yml`, remove, verbose)

         // Ubuntu 21.04 hirsute. Eredita da focal
         const hirsute = `${rootPen}/conf/distros/hirsute`
         await this.ln(`${focal}/calamares`, `${hirsute}/calamares`, remove, verbose)
         await this.ln(`${focal}/grub`, `${hirsute}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${hirsute}/isolinux`, remove, verbose)
         await this.ln(`${focal}/locale.gen.template`, `${hirsute}/locale.gen.template`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${hirsute}/calamares/modules/displaymanager.yml`, remove, verbose)

         // Ubuntu 21.10 impish. Eredita da focal
         const impish = `${rootPen}/conf/distros/impish`
         await this.ln(`${focal}/calamares`, `${impish}/calamares`, remove, verbose)
         await this.ln(`${focal}/grub`, `${impish}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${impish}/isolinux`, remove, verbose)
         await this.ln(`${focal}/locale.gen.template`, `${impish}/locale.gen.template`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${impish}/calamares/modules/displaymanager.yml`, remove, verbose)

         // Ubuntu 22.04 jammy. Eredita da focal
         const jammy = `${rootPen}/conf/distros/jammy`
         await this.ln(`${focal}/calamares`, `${jammy}/calamares`, remove, verbose)
         await this.ln(`${focal}/grub`, `${jammy}/grub`, remove, verbose)
         await this.ln(`${focal}/isolinux`, `${jammy}/isolinux`, remove, verbose)
         await this.ln(`${focal}/locale.gen.template`, `${jammy}/locale.gen.template`, remove, verbose)
         await this.ln(`${buster}/calamares/modules/displaymanager.yml`, `${jammy}/calamares/modules/displaymanager.yml`, remove, verbose)
      }
   }

   /**
    * 
    * @param mode 
    * @param src 
    * @param dest 
    * @param verbose 
    */
   static async ln(src: string, dest: string, remove = false, verbose = false) {
      const rel = path.relative(dest, src).substring(3)

      // Cancella il symlink se esiste
      if (fs.existsSync(dest)) {
         if (verbose) {
            console.log(`remove ${dest}`)
         }
         fs.unlinkSync(dest)
      }

      if (!remove) {
         const dirname = path.dirname(dest)
         const basename = path.basename(dest)

         process.chdir(dirname)
         if (verbose) {
            console.log(`cd ${dirname}`)
            console.log(`ln -s ${rel} ${basename}\n`)
         }
         fs.symlinkSync(rel, basename)
      }
   }


   /**
   * restuisce VERO se il pacchetto è installato
   * @param debPackage
   */
   static packageIsInstalled(debPackage: string): boolean {

      let installed = false
      if (this.distro().familyId === 'debian') {
         installed = Debian.packageIsInstalled(debPackage)
      }
      return installed
   }


   /**
   * restuisce VERO se il pacchetto è installato
   * @param debPackage
   */
   static async packageAptAvailable(packageName: string): Promise<boolean> {
      let available = false

      if (this.distro().familyId === 'debian') {
         available = Debian.packageIsInstalled(packageName)
      }
      return available
   }

   /**
    * 
    * @param debPackage 
    * @returns 
    */
   static async packageAptLast(debPackage: string): Promise<string> {
      let version = ''
      if (this.distro().familyId === 'debian') {
         version = await Debian.packageAptLast(debPackage)
      }
      return version
   }

   static async packageNpmLast(packageNpm = 'penguins-eggs'): Promise<string> {
      return shx.exec('npm show ' + packageNpm + ' version', { silent: true }).stdout.trim()
   }

   /**
    * 
    * @param cmd 
    */
   static async commandIsInstalled(cmd: string): Promise<boolean> {
      let installed = false

      const stdout = shx.exec(`command -v ${cmd}`, { silent: true }).stdout.trim()
      if (stdout !== '') {
         installed = true
      } else {
         Utils.warning(`${cmd} is not in your search path or is not installed!`)
      }
      return installed
   }

   /**
    * Install the package packageName
    * @param packageName {string} Pacchetto Debian da installare
    * @returns {boolean} True if success
    */
   static async packageInstall(packageName: string): Promise<boolean> {
      let retVal = false

      if (this.distro().familyId === 'debian') {
         retVal = await Debian.packageInstall(packageName)
      }
      return retVal
   }

   /**
    *
    * @param packages array packages
    * 
    * Probabilmente da rimuovere, viene usata solo da prerequisitesRemove
    * 
    */
   static filterInstalled(packages: string[]): string[] {

      let installed: string[] = []

      for (const i in packages) {
         if (Pacman.packageIsInstalled(packages[i])) {
            installed.push(packages[i])
         }
      }
      return installed
   }
}
