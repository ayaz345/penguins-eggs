penguins-eggs
=============

## Penguin&#39;s eggs are generated and new birds are ready to fly...
[![sources](https://img.shields.io/badge/github-sources-cyan)](https://github.com/pieroproietti/penguins-eggs)
[![blog](https://img.shields.io/badge/blog-penguin's%20eggs-cyan)](https://penguins-eggs.net)
[![guide](https://img.shields.io/badge/guide-penguin's%20eggs-cyan)](https://penguins-eggs.net/docs/Tutorial/eggs-users-guide)
[![npm version](https://img.shields.io/npm/v/penguins-eggs.svg)](https://npmjs.org/package/penguins-eggs)
[![deb](https://img.shields.io/badge/deb-packages-blue)](https://sourceforge.net/projects/penguins-eggs/files/DEBS)
[![pkgbuild](https://img.shields.io/badge/pkgbuild-packages-blue)](https://sourceforge.net/projects/penguins-eggs/files/PKGBUILD)[![iso](https://img.shields.io/badge/iso-images-cyan)](https://sourceforge.net/projects/penguins-eggs/files/ISOS)


# Penguins' eggs remastered ISOs

# user/password
* ```live/evolution```
* ```root/evolution```

All ISOs include eggs, you can udate it with: ```sudo eggs update```.

# [Waydroid - Container-based Android for Linux](https://waydro.id/)

A container-based approach to boot a full Android system on a regular GNU/Linux system like Ubuntu.

## **egg-of-debian-bullseye-go**

This iso is a special version of `egg-of-debian-bullseye-colibri`, created with the `bliss` theme for the installation of `Bliss-v15.8.5-x86_64-OFFICIAL-foss-20230331.iso`.

For Go to work properly, a virtual machine with two hard drives is required, in which, you will use the second hard drive `/dev/sdb1` to save the `Bliss-v15.8.5-x86_64-OFFICIAL-foss-20230331.iso` for our tests.

At the moment, all the steps are done, I had to re-enter zenity instead of dialog, the boot menus are created but, at least to me, the installed system does NOT work.

## **egg-of-arch-rolling-go**

it works - and has the same problems - as the corresponding one for Debian.

The problems, however by now should only be inherent in the teme bliss scripts, which is included in the repository https://github.com/pieroproietti/penguins-wardrobe under vendors.

There are basically three scripts: cfs-install.sh, cfs-data-img.sh, and cfg-bootloader.sh that are executed by calamares or krill (a quick and rudimentary CLI installer) at the end of the installation process.

##  **wagtail**
A light wayland/gnome/waydroid for developers

##  **warbler**
A light wayland/kde/waydroid for developers

##  **whipbird**
An ultra light wayland/weston/waydroid for developers


* If you want the official waydroid version look at [Waydroid](https://waydro.id/#wdlinux). 

### NOTE

This waydroid customization are made mostly for developers. so I put inside just firmware for wifi to let you to be able to get what else you need. All the versions are configured with ``no-hardware-accelleration`` to be used, modified and remastered under a virtualizator: [proxmox-ve](https://www.proxmox.com/en/proxmox-ve), virtualbox or others.

I'm using an automatic method to build this iso: I just start with a minimal Debian bookworm CLI, add eggs and - basically - give the following commands:

`eggs wardrobe get`

`sudo eggs wardrobe wear wagtail / warbler / whipbird`

After that reboot, You are ready!

If you want remaster your customized version, just:

`sudo eggs calamares --install`

`sudo eggs tools clean`

`sudo eggs produce --fast theme ./wardrobe/themes/waydroid`

**Support me and give feedback please: https://t.me/penguins_eggs**


# Installing Linux Waydroid via PXE

One feature of ISO images made with eggs is the ability to be used for network installation . All you have to do is boot the ISO to be installed, open a terminal window and type the command: 

``sudo eggs cuckoo``.

Then all you have to do is boot from the network the machines to be installed and start the calamares or krill installer.

You can also perform an unattended installation with krill, see the [manual](https://penguins-eggs.net/docs/Tutorial/english) or, find assistance in the [telegram Penguins' eggs](https://t.me/penguins_eggs) group.



## More informations:

* Repository: [penguins-eggs](https://github.com/pieroproietti/penguins-eggs)
* Blog: [penguins-eggs](https://penguins-eggs.net)

* You can find more informations on this Linux distro at: [Waydroid - Container-based Android for Linux](https://waydro.id/).


Disclaim

__Please note what this project is in no way connected to the original distro in any official way, it’s just my personal experiment.__
