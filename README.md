[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine)

penguins-eggs
=============

### Penguin&#39;s eggs are generated and new birds are ready to fly...
[![sources](https://img.shields.io/badge/github-sources-blue)](https://github.com/pieroproietti/penguins-eggs)
[![blog](https://img.shields.io/badge/blog-penguin's%20eggs-blue)](https://penguins-eggs.net)
[![sources-documentation](https://img.shields.io/badge/sources-documentation-blue)](https://penguins-eggs.sourceforge.io/)
[![guide](https://img.shields.io/badge/guide-penguin's%20eggs-blue)](https://penguins-eggs.net/book/)
[![npm version](https://img.shields.io/npm/v/penguins-eggs.svg)](https://npmjs.org/package/penguins-eggs)
[![deb](https://img.shields.io/badge/deb-packages-orange)](https://sourceforge.net/projects/penguins-eggs/files/packages-deb)
[![iso](https://img.shields.io/badge/iso-images-orange)](https://sourceforge.net/projects/penguins-eggs/files/iso)


# Index
<!-- toc -->
* [Index](#index)
* [Presentation](#presentation)
* [Packages](#packages)
* [Usage](#usage)
* [Commands](#commands)
* [Terminal samples](#terminal-samples)
* [That's all Folks!](#thats-all-folks)
<!-- tocstop -->

# Presentation
penguins-eggs is a console utility, under continuous development, that allows you to remaster your system and redistribute it as iso images.

The purpose of this project is to implement the process of remastering your own version of Linux, generate it as an ISO image to burn to a CD/DVD or copy to a USB stick to boot your system. The default behavior is total removal of the system's data and users, but it is also possible to remaster the system including the data and accounts of present users, use flag **--clone**. It is also possible to keep the users and files present in an encrypted LUKS file within the same resulting iso file, flag **--backup**.

You can easily install the resulting live system with the calamares installer or the internal TUI krill installer.

Also, thanks to the wardrobe, you can create or use scripts to switch from a "naked" version - with only a CLI interface - and "wear" it with a GUI or server configurations. See [penguins-wardrobe](https://github.com/pieroproietti/penguins-wardrobe), fork it and adapt it to yours needs.


## Tecnology

The whole thing is written in pure typescript, so ideally it can be used with different Linux distributions. Yes, there are major differences in terms of the package manager used, but not so much on the way the various programs used to build the isos work. Actually eggs support: Debian, Devuan, Ubuntu, Arch and ManjaroLinux.

### What distributions can I use?
eggs was born on Debian strecth, buster and followinng. Actually full support Debian from jessie to bookworm/sid, Devuan beowulf, chimaera, daedalus, Ubuntu bionic, focal, jammy  - and all derivatives from them including Linux mint, Deepin, neon KDE, etc - Arch and ManjaroLinux.

You can read more on the [blog](https://penguins-eggs.net/2021/11/02/distros-that-can-be-remastered-with-eggs/), some examples of iso images remastered with eggs are in the [sourceforge page of the project](https://sourceforge.net/projects/penguins-eggs/files/iso/). 

### What architecture can I use?
Eggs, can be released for differents architectures: **amd64**, **arm64** and **armel**. Actually I'm producing mainly for PCs (amd64). Someone want to contribute to bring eggs on [raspberrypi](https://www.raspberrypi.org/)?

## Packages
Supporting various distributions, we need to have different packages. Debian, Devuan and Ubuntu share the .deb package of eggs, while for Arch Linux and ManjaroLinux they use their PKGBUILD.

### Packages .deb
eggs is released deb packages for amd64, armel and arm64 architectures. Due the characteristic of eggs, they can installed in Debian, Devuan or Ubuntu based distros, withouth worries about different versions, except for the architecture. It include standard scripts for preinst, postinst, prerm and postrm.
The packages usually go before in sourgeforce page of eggs, (unstable version) and later in ppa (stable version).

#### Install eggs
There are more than a way to install eggs, the most common it's to use penguins-eggs-ppa.

##### Using penguins-eggs-ppa (stable version)

eggs have it's repository ppa, You can use it, copy and paste in a terminal window the following two lines:

```
curl -SsL  https://pieroproietti.github.io/penguins-eggs-ppa/KEY.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/penguins-eggs-ppa-keyring.gpg
sudo curl -s --compressed -o /etc/apt/sources.list.d/penguins-eggs-ppa.list "https://pieroproietti.github.io/penguins-eggs-ppa/penguins-eggs-ppa.list"
```

Update your repositories: **sudo apt update** and install eggs: **sudo apt install eggs**.

##### Download the package and install with dpkg

The simplest way to install eggs is download the [package eggs](https://sourceforge.net/projects/penguins-eggs/files/packages-deb/) from [sourceforge page of the project](https://sourceforge.net/projects/penguins-eggs/) and install it

```
sudo dpkg -i eggs_9.1.26_amd64.deb
```

or, on a i386 system:
```
sudo dpkg -i eggs_8.17.17-1_i386.deb
```

#### Upgrade eggs
If you are using penguins-eggs-ppa You can ugrade eggs as others packages just: **sudo apt upgrade**.

##### Manual upgrade
Simply download new versions of eggs from [sourgeforge page](https://sourceforge.net/projects/penguins-eggs/files/packages-deb/) and install it with the standard command **sudo dpkg -i eggs_8.17.x-1_amd64.deb**.

### PKGBUILD (Arch and ManjaroLinux)
eggs has been present in AUR for a long time, even without my knowledge. I am currently directly maintaining the AUR version for Arch linux, however you can refer to the versions for Arch and manjaroLinux in their respective repositories on github.

To install eggs on Arch, simply ```git clone https://github.com/pieroproietti/penguins-eggs-arch```, ```cd penguins-eggs-arch```, then  ```makepkg -si```.


The same for manjaroLinux: ```git clone https://github.com/pieroproietti/penguins-eggs-manjaro```, ```cd penguins-eggs-manjaro```, then  ```makepkg -si```.

## features

### mom and dad
I've added two lightweight assistants integrated with eggs: mom and dad. While mom is a bash script with whiptail - and guides the user to the various commands and documentation, dad started as a short way to create isos. All you have to do is type **sudo eggs dad** and follow simple instructions. You can also shortcut the way to reset the configuration **sudo dad -c** or - even faster - reset the configuration, load defaults, kill created isos: simply type **sudo eggs dad -d** and you will immediately be able to produce the egg in the default /home/eggs nest.

### yolk 
yolk - so called staying on the subject of eggs - is a local repository included in the livecd that contains a minimum of indispensable packages during installation. Thanks to yolk, you can safely install your system without the need of an active internet connection.

### wardrobe
wardrobe was added to eggs on april 2022, it's is a way to guide and consolidate the process of creating a custom version of Linux, starting from a CLI system. All my personal editions are passed to use wardrobe for their convenience, in that way I can organize, consolidate and manage better my work. I used birds names for my customizations, we have: colibri, duck, eagle, owl, wagtail and warbier. 

I hope peoples will be interested in wardrobe and you will end to fork the main repository and add your customizations: together will be possibile to make great steps impossible for a single developer. 

You can read more in wardrobe on [penguin's eggs blog](https://penguins-eggs.net/2022/04/12/wardrobe-colibri-duck-eagle-and-owl/). The results of mine customizations are mostly under [Debian bullseye](https://sourceforge.net/projects/penguins-eggs/files/iso/debian/bullseye/), [Devuan chimaera](ttps://sourceforge.net/projects/penguins-eggs/files/iso/devuan/chimaera/) and [Ubuntu jammy](https://sourceforge.net/projects/penguins-eggs/files/iso/ubuntu/jammy/) on my sourgeforce page.

### krill
eggs include a CLI installer named krill, this let you to produce and install servers configurations. krill use a nice TUI interface using the same, configuration created by eggs for [calamares](calamares.io). This lead to have "about the same" experience installing, from old distros to new ones and for GUI and CLI. To force using krill in place of calamares in a GUI system just: **sudo eggs install --cli**

### addons and themes
Addons are used mostly to let third parties to develop extensions. Note that currently we have an extension for the theme that includes both branding calamares, link and installer icon. In addition, also as an addon has been developed choose between GUI or CLI installation, adapt the video resolution, link to remote support, etc.

### backup/clone

We have two methods to save in the live systema all our data: clone and backup.

```eggs produces --fast --clone``` saves our users and our data directly in the generated iso. The data will be visible directly from the live and accessible to anyone who gets a copy.

```eggs produces --fast --backup``` saves our data within the generated iso using a LUKS volume. Our data will NOT be visible in the live system but can be reinstalled automatically with krill installer. Even having the generated image available, our data will be protected by the LUKS passphrase.

* ```eggs produce``` just users accounts and homes.
* ```eggs produce --clone``` include all users data UNCRYPTED directly on the live.
* ```eggs produce --backup``` include all users data CRYPTED on a LUKS volume inside the iso.

**NOTE:** 
Using ```sudo eggs krill --cli``` will restore your CRYPTED backup automatically. Of course the original passphrase will be request.





# Usage
In addition to the description of the commands in this README, you can consult the [Penguin's eggs official book](https://penguins-eggs.net/book/).

<!-- usage -->
```sh-session
$ npm install -g penguins-eggs
$ eggs COMMAND
running command...
$ eggs (--version|-v)
penguins-eggs/9.2.2 linux-x64 node-v16.16.0
$ eggs --help [COMMAND]
USAGE
  $ eggs COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`eggs adapt`](#eggs-adapt)
* [`eggs analyze`](#eggs-analyze)
* [`eggs autocomplete [SHELL]`](#eggs-autocomplete-shell)
* [`eggs calamares`](#eggs-calamares)
* [`eggs config`](#eggs-config)
* [`eggs dad`](#eggs-dad)
* [`eggs export deb`](#eggs-export-deb)
* [`eggs export docs`](#eggs-export-docs)
* [`eggs export iso`](#eggs-export-iso)
* [`eggs help [COMMAND]`](#eggs-help-command)
* [`eggs info`](#eggs-info)
* [`eggs install`](#eggs-install)
* [`eggs kill`](#eggs-kill)
* [`eggs krill`](#eggs-krill)
* [`eggs mom`](#eggs-mom)
* [`eggs produce`](#eggs-produce)
* [`eggs syncfrom`](#eggs-syncfrom)
* [`eggs syncto`](#eggs-syncto)
* [`eggs tools clean`](#eggs-tools-clean)
* [`eggs tools skel`](#eggs-tools-skel)
* [`eggs tools stat`](#eggs-tools-stat)
* [`eggs tools yolk`](#eggs-tools-yolk)
* [`eggs update`](#eggs-update)
* [`eggs version`](#eggs-version)
* [`eggs wardrobe get [REPO]`](#eggs-wardrobe-get-repo)
* [`eggs wardrobe ironing [COSTUME]`](#eggs-wardrobe-ironing-costume)
* [`eggs wardrobe list [WARDROBE]`](#eggs-wardrobe-list-wardrobe)
* [`eggs wardrobe show [COSTUME]`](#eggs-wardrobe-show-costume)
* [`eggs wardrobe wear [COSTUME]`](#eggs-wardrobe-wear-costume)

## `eggs adapt`

adapt monitor resolution for VM only

```
USAGE
  $ eggs adapt [-v] [-h]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  adapt monitor resolution for VM only
```

_See code: [src/commands/adapt.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/adapt.ts)_

## `eggs analyze`

analyze for syncto

```
USAGE
  $ eggs analyze [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose  verbose

DESCRIPTION
  analyze for syncto

EXAMPLES
  $ sudo eggs analyze
```

_See code: [src/commands/analyze.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/analyze.ts)_

## `eggs autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ eggs autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ eggs autocomplete

  $ eggs autocomplete bash

  $ eggs autocomplete zsh

  $ eggs autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.0/src/commands/autocomplete/index.ts)_

## `eggs calamares`

calamares or install or configure it

```
USAGE
  $ eggs calamares [-h] [-v] [-i] [-r] [--remove] [--theme <value>]

FLAGS
  -h, --help       Show CLI help.
  -i, --install    install calamares and it's dependencies
  -r, --release    release: remove calamares and all it's dependencies after the installation
  -v, --verbose
  --remove         remove calamares and it's dependencies
  --theme=<value>  theme/branding for eggs and calamares

DESCRIPTION
  calamares or install or configure it

EXAMPLES
  ~$ sudo eggs calamares 
  create/renew calamares configuration's files

  ~$ sudo eggs calamares -i 
  install calamares and create it's configuration's files
```

_See code: [src/commands/calamares.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/calamares.ts)_

## `eggs config`

Configure and install prerequisites deb packages to run it

```
USAGE
  $ eggs config [-n] [-c] [-h] [-v]

FLAGS
  -c, --clean          remove old configuration before to create new one
  -h, --help           Show CLI help.
  -n, --nointeractive  assume yes
  -v, --verbose        verbose

DESCRIPTION
  Configure and install prerequisites deb packages to run it

EXAMPLES
  ~$ sudo eggs config
  Configure and install prerequisites deb packages to run it
```

_See code: [src/commands/config.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/config.ts)_

## `eggs dad`

ask help from daddy - configuration helper

```
USAGE
  $ eggs dad [-h] [-c] [-d] [-v]

FLAGS
  -c, --clean    remove old configuration before to create
  -d, --default  remove old configuration and force default
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  ask help from daddy - configuration helper
```

_See code: [src/commands/dad.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/dad.ts)_

## `eggs export deb`

export deb/docs/iso to the destination host

```
USAGE
  $ eggs export deb [-h] [-c] [--amd64] [--i386] [--armel] [--arm64] [-a]

FLAGS
  -a, --all    export all archs
  -c, --clean  remove old .deb before to copy
  -h, --help   Show CLI help.
  --amd64      export amd64 arch
  --arm64      export arm64 arch
  --armel      export armel arch
  --i386       export i386 arch

DESCRIPTION
  export deb/docs/iso to the destination host
```

## `eggs export docs`

remove and export docType documentation of the sources in the destination host

```
USAGE
  $ eggs export docs [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  remove and export docType documentation of the sources in the destination host
```

## `eggs export iso`

export iso in the destination host

```
USAGE
  $ eggs export iso [-h] [-b] [-c]

FLAGS
  -b, --backup  export backup ISOs
  -c, --clean   delete old ISOs before to copy
  -h, --help    Show CLI help.

DESCRIPTION
  export iso in the destination host
```

## `eggs help [COMMAND]`

Display help for eggs.

```
USAGE
  $ eggs help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for eggs.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `eggs info`

informations about eggs configuration

```
USAGE
  $ eggs info [-v] [-h]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  informations about eggs configuration
```

_See code: [src/commands/info.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/info.ts)_

## `eggs install`

command-line system installer - the egg became a penguin!

```
USAGE
  $ eggs install [-k] [-p] [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -k, --crypted  crypted CLI installation
  -p, --pve      Proxmox VE install
  -v, --verbose  verbose

DESCRIPTION
  command-line system installer - the egg became a penguin!

ALIASES
  $ eggs krill

EXAMPLES
  $ eggs install
  Install the system using krill installer
```

_See code: [src/commands/install.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/install.ts)_

## `eggs kill`

kill the eggs/free the nest

```
USAGE
  $ eggs kill [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose  verbose

DESCRIPTION
  kill the eggs/free the nest

EXAMPLES
  $ eggs kill
  kill the eggs/free the nest
```

_See code: [src/commands/kill.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/kill.ts)_

## `eggs krill`

command-line system installer - the egg became a penguin!

```
USAGE
  $ eggs krill [-k] [-p] [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -k, --crypted  crypted CLI installation
  -p, --pve      Proxmox VE install
  -v, --verbose  verbose

DESCRIPTION
  command-line system installer - the egg became a penguin!

ALIASES
  $ eggs krill

EXAMPLES
  $ eggs install
  Install the system using krill installer
```

## `eggs mom`

ask for mommy - gui helper

```
USAGE
  $ eggs mom [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  ask for mommy - gui helper
```

_See code: [src/commands/mom.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/mom.ts)_

## `eggs produce`

produce a live image from your system whithout your data

```
USAGE
  $ eggs produce [-p <value>] [--basename <value>] [-b] [-c] [-f] [-n] [-m] [-v] [-y] [-s] [-h] [--theme
    <value>] [--addons <value>] [--release]

FLAGS
  -b, --backup          backup mode (CRYPTED)
  -c, --clone           clone mode
  -f, --fast            fast compression
  -h, --help            Show CLI help.
  -m, --max             max compression
  -n, --normal          normal compression
  -p, --prefix=<value>  prefix
  -s, --script          script mode. Generate scripts to manage iso build
  -v, --verbose         verbose
  -y, --yolk            -y force yolk renew
  --addons=<value>...   addons to be used: adapt, ichoice, pve, rsupport
  --basename=<value>    basename
  --release             release: max compression, remove penguins-eggs and calamares after installation
  --theme=<value>       theme for livecd, calamares branding and partitions

DESCRIPTION
  produce a live image from your system whithout your data

EXAMPLES
  $ sudo eggs produce 
  produce an ISO called [hostname]-[arch]-YYYY-MM-DD_HHMM.iso, compressed xz (standard compression).
  If hostname=ugo and arch=i386 ugo-x86-2020-08-25_1215.iso

  $ sudo eggs produce -v
  same as previuos, but with --verbose output

  $ sudo eggs produce -vf
  same as previuos, compression zstd, lz4 or gzip (depend from system capability)

  $ sudo eggs produce -vm
  same as previuos, compression xz -Xbcj x86 (max compression, about 10%
  more compressed)

  $ sudo eggs produce -vf --basename leo --theme debian --addons adapt 
  produce an ISO called leo-i386-2020-08-25_1215.iso compression fast,
  using Debian theme and link to adapt

  $ sudo eggs produce -v --basename leo --theme debian --addons rsupport 
  produce an ISO called leo-i386-2020-08-25_1215.iso compression xz,
  using Debian theme and link to dwagent

  $ sudo eggs produce -v --basename leo --rsupport 
  produce an ISO called leo-i386-2020-08-25_1215.iso compression xz, using eggs
  theme and link to dwagent

  $ sudo eggs produce -vs --basename leo --rsupport 
  produce scripts to build an ISO as the previus example. Scripts can be found
  in /home/eggs/ovarium and you can customize all you need
```

_See code: [src/commands/produce.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/produce.ts)_

## `eggs syncfrom`

restore users and user data from a LUKS volumes

```
USAGE
  $ eggs syncfrom [--delete <value>] [-f <value>] [-r <value>] [-h] [-v]

FLAGS
  -f, --file=<value>     file LUKS volume encrypted
  -h, --help             Show CLI help.
  -r, --rootdir=<value>  rootdir of the installed system, when used from live
  -v, --verbose          verbose
  --delete=<value>       rsync --delete delete extraneous files from dest dirs

DESCRIPTION
  restore users and user data from a LUKS volumes

EXAMPLES
  $ sudo eggs restore
```

_See code: [src/commands/syncfrom.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/syncfrom.ts)_

## `eggs syncto`

saves users and user data in a LUKS volume inside the iso

```
USAGE
  $ eggs syncto [--delete <value>] [-f <value>] [-h] [-v]

FLAGS
  -f, --file=<value>  file LUKS volume encrypted
  -h, --help          Show CLI help.
  -v, --verbose       verbose
  --delete=<value>    rsync --delete delete extraneous files from dest dirs

DESCRIPTION
  saves users and user data in a LUKS volume inside the iso

EXAMPLES
  $ sudo eggs syncto
```

_See code: [src/commands/syncto.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/syncto.ts)_

## `eggs tools clean`

clean system log, apt, etc

```
USAGE
  $ eggs tools clean [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose  verbose

DESCRIPTION
  clean system log, apt, etc
```

## `eggs tools skel`

update skel from home configuration

```
USAGE
  $ eggs tools skel [-h] [-u <value>] [-v]

FLAGS
  -h, --help          Show CLI help.
  -u, --user=<value>  user to be used
  -v, --verbose

DESCRIPTION
  update skel from home configuration

EXAMPLES
  $ eggs skel --user mauro
  desktop configuration of user mauro will get used as default
```

## `eggs tools stat`

get statistics from sourceforge

```
USAGE
  $ eggs tools stat [-h] [-m] [-y]

FLAGS
  -h, --help   Show CLI help.
  -m, --month  current month
  -y, --year   current year

DESCRIPTION
  get statistics from sourceforge
```

## `eggs tools yolk`

configure eggs to install without internet

```
USAGE
  $ eggs tools yolk [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  configure eggs to install without internet

EXAMPLES
  $ eggs yolk -v
```

## `eggs update`

update the penguin's eggs tool

```
USAGE
  $ eggs update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose  verbose

DESCRIPTION
  update the penguin's eggs tool

EXAMPLES
  $ eggs update
  update/upgrade the penguin's eggs tool
```

_See code: [src/commands/update.ts](https://github.com/pieroproietti/penguins-eggs/blob/v9.2.2/src/commands/update.ts)_

## `eggs version`

```
USAGE
  $ eggs version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.1.1/src/commands/version.ts)_

## `eggs wardrobe get [REPO]`

get warorobe

```
USAGE
  $ eggs wardrobe get [REPO] [-v] [-h]

ARGUMENTS
  REPO  repository to get

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  get warorobe
```

## `eggs wardrobe ironing [COSTUME]`

ordered show of costumes or accessories in wardrobe

```
USAGE
  $ eggs wardrobe ironing [COSTUME] [-w <value>] [-v] [-h]

ARGUMENTS
  COSTUME  costume

FLAGS
  -h, --help              Show CLI help.
  -v, --verbose
  -w, --wardrobe=<value>  wardrobe

DESCRIPTION
  ordered show of costumes or accessories in wardrobe
```

## `eggs wardrobe list [WARDROBE]`

list costumes and accessoires in wardrobe

```
USAGE
  $ eggs wardrobe list [WARDROBE] [-v] [-h]

ARGUMENTS
  WARDROBE  wardrobe

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  list costumes and accessoires in wardrobe
```

## `eggs wardrobe show [COSTUME]`

show costumes/accessories in wardrobe

```
USAGE
  $ eggs wardrobe show [COSTUME] [-w <value>] [-j] [-v] [-h]

ARGUMENTS
  COSTUME  costume

FLAGS
  -h, --help              Show CLI help.
  -j, --json              output JSON
  -v, --verbose
  -w, --wardrobe=<value>  wardrobe

DESCRIPTION
  show costumes/accessories in wardrobe
```

## `eggs wardrobe wear [COSTUME]`

wear costume/accessories from wardrobe

```
USAGE
  $ eggs wardrobe wear [COSTUME] [-w <value>] [-a] [-f] [-s] [-v] [-h]

ARGUMENTS
  COSTUME  costume

FLAGS
  -a, --no_accessories    not install accessories
  -f, --no_firmwares      not install firmwares
  -h, --help              Show CLI help.
  -s, --silent
  -v, --verbose
  -w, --wardrobe=<value>  wardrobe

DESCRIPTION
  wear costume/accessories from wardrobe
```
<!-- commandsstop -->

# Terminal samples

![terminal samples](https://github.com/pieroproietti/penguins-eggs/blob/master/documents/terminal-lessons/eggs_help.gif?raw=true)

# That's all Folks!
No need other configurations, penguins-eggs are battery included or better, as in the real, live is inside! :-D

## More informations
There is a [Penguin's eggs official book](https://penguins-eggs.net/book/) and same other documentation - mostly for developers - on [penguins-eggs repo](https://github.com/pieroproietti/penguins-eggs) under **documents** and **i386**, in particular we have [hens, differents species](https://github.com/pieroproietti/penguins-eggs/blob/master/documents/hens-different-species.md) who descrive how to use eggs in manjaro.

* [blog](https://penguins-eggs.net)    
* [facebook penguin's eggs group](https://www.facebook.com/groups/128861437762355/)
* [sources](https://github.com/pieroproietti/penguins-krill)
* [telegram](https://t.me/penguins_eggs) penguin's eggs channel
* [twitter](https://twitter.com/pieroproietti)

You can contact me at pieroproietti@gmail.com or [meet me](https://meet.jit.si/PenguinsEggsMeeting)

## Copyright and licenses
Copyright (c) 2017, 2021 [Piero Proietti](https://penguins-eggs.net/about-me.html), dual licensed under the MIT or GPL Version 2 licenses.
