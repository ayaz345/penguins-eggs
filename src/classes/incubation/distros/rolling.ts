/**
 * penguins-eggs: rolling.ts
 */

import CFS from '../../cfs'
import { IInstaller, IRemix, IDistro } from '../../../interfaces/index'
import Fisherman from '../fisherman'

/**
  *
  */
export class Rolling {
  installer = {} as IInstaller

  remix: IRemix

  distro: IDistro

  user_opt: string

  release = false

  theme: string // theme comprende il path

  verbose = false

  isClone = false

  /**
   * @param remix
   * @param distro
   * @param displaymanager
   * @param verbose
   */
  constructor(installer: IInstaller, remix: IRemix, distro: IDistro, user_opt: string, release = false, theme = 'eggs', isClone = false, verbose = false) {
    this.installer = installer

    this.remix = remix
    this.distro = distro
    this.user_opt = user_opt
    this.verbose = verbose
    this.release = release
    this.theme = theme
    this.isClone = isClone
  }

  /**
  * locale, partitions, users can come from themes
  */
  async create() {
    const fisherman = new Fisherman(this.distro, this.installer, this.verbose)

    await fisherman.createCalamaresSettings(this.theme, this.isClone)

    await fisherman.buildModule('partition', this.theme)
    await fisherman.buildModule('mount')
    await fisherman.moduleUnpackfs()
    // await fisherman.buildCalamaresModule('sources-yolk', true)
    // await fisherman.buildModule('machineid')
    await fisherman.buildModule('fstab')
    await fisherman.buildModule('locale', this.theme)
    await fisherman.buildModule('keyboard')
    await fisherman.buildModule('localecfg')
    await fisherman.buildModule('users', this.theme)
    await fisherman.moduleDisplaymanager()
    await fisherman.buildModule('networkcfg')
    await fisherman.buildModule('hwclock')
    // await fisherman.buildModule('services-systemd')
    // await fisherman.buildCalamaresModule('bootloader-config', true)
    await fisherman.buildModule('grubcf')
    await fisherman.buildModule('bootloader')
    await fisherman.modulePackages(this.distro, this.release)
    await fisherman.buildModule('luksbootkeyfile')
    await fisherman.buildModule('plymouthcfg')
    // await fisherman.buildModule('initramfscfg')
    // await fisherman.buildModule('initramfs')
    await fisherman.moduleRemoveuser(this.user_opt)
    await fisherman.shellprocess('removelink')

    /**
     * cfs: custom final steps   
     */
    const cfs = new CFS()
    const steps = cfs.steps()
    if (steps.length > 0) {
      for (const step of steps) {
        await fisherman.buildCalamaresModule(step, true, this.theme)
      }
    }

    await fisherman.buildModule('umount')
    await fisherman.moduleFinished()
  }
}
