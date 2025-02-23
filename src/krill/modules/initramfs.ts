/**
 * krill: module initramfs
 *
 * author: Piero Proietti
 * mail: piero.proietti@gmail.com
 *
 * https://stackoverflow.com/questions/23876782/how-do-i-split-a-typescript-class-into-multiple-files
 */

import Sequence from '../krill-sequence'
import {exec} from '../../lib/utils'
import Utils from '../../classes/utils'
import path from 'path'

/**
   * initramfs()
   */
export default async function initramfs(this: Sequence) {
  if (this.distro.familyId === 'debian') {
    let cmd = `chroot ${this.installTarget} mkinitramfs -o ~/initrd.img-$(uname -r) ${this.toNull}`
    try {
      await exec(cmd, this.echo)
    } catch {
      await Utils.pressKeyToExit(cmd)
    }

    cmd = `chroot ${this.installTarget} mv ~/initrd.img-$(uname -r) /boot ${this.toNull}`
    try {
      await exec(cmd, this.echo)
    } catch {
      await Utils.pressKeyToExit(cmd)
    }
  } else if (this.distro.familyId === 'archlinux') {
    let initrdImg = Utils.initrdImg()
    initrdImg = initrdImg.slice(Math.max(0, initrdImg.lastIndexOf('/') + 1))
    let cmd = `mkinitcpio -c ${path.resolve(__dirname, '../../../mkinitcpio/arch/mkinitcpio-install.conf')} -g ${this.installTarget}/boot/${initrdImg}`
    if (this.distro.distroId === 'Manjaro') {
      cmd = `mkinitcpio -c ${path.resolve(__dirname, '../../../mkinitcpio/manjaro/mkinitcpio-install.conf')} -g ${this.installTarget}/boot/${initrdImg}` // ${this.toNull}
    }

    try {
      await exec(cmd, Utils.setEcho(true))
    } catch {
      await Utils.pressKeyToExit(cmd)
    }
  }
}
