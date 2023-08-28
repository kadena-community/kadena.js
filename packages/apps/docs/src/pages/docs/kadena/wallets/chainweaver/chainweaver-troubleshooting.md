---
title: Troubleshooting Chainweaver
description: Troubleshooting Chainweaver
menu: Chainweaver
label: Troubleshooting
order: 3
layout: full
---

### Debian Installation Issues

If you think that the install didn't update your Chainweaver, jump into a
terminal and enter

`dpkg -s kadena-chainweaver`

If this doesn't return the Chainweaver version that you expect, then the
automatic install window didn't work. Type

`sudo dpkg -i ~/Downloads/kadena-chainweaver_1.0.0_amd64.deb`

to try to install from the terminal. If something is going wrong, this will give
a much better error.

#### Uninstall Chainweaver

To remove Chainweaver (this won't delete your wallet, just chainweaver itself)
to try to reinstall, type `sudo dpkg -r kadena-chainweaver` in a terminal.

### OVA Installation Issues

#### Starting the Virtual Machine

You don't need to import the ova each time to run Chainweaver. To start
Chainweaver again, open Virtual Box from the start menu. The Virtual Box Manager
should open up and you can double click "Chainweaver VM".

![ova vm menu](/assets/docs/ova_startvm.png)

#### Stopping the Virtual Machine

To stop the virtual machine, it is best to shut it down like a regular computer.
Press "Applications" in the lower left corner.

![applications menu](/assets/docs/ova_menu.png)

And press "Log Off" then hit "Shutdown in the Dialog that appears.

![shutdown menu](/assets/docs/ova_shutdown.png)

It is safe to close the "Virtual Box Manager" window at this time.

#### Upgrading the Virtual Machine

When a new Chainweaver is released, you don't need to download a new OVA every
time. Instead, close the Chainweaver application inside the VM and notice these
two icons on the desktop. Click the "Upgrade Chainweaver" icon and an update
script will start. You can then click the other desktop icon to restart
Chainweaver.

![desktop icons](/assets/docs/ova_desktop.png)

#### VT-x / AMD-v Error on Import / Startup

Virtualbox requires certain hardware acceleration to be able to operate. Almost
all modern computers have this feature (VT-x for Intel and AMD-v for AMD CPUs)
but some computers ship with it off by default. If you see an error like this
when importing or starting the VM, it is turned off for your computer.

![Virtualisation CPU support error](/assets/docs/ova_vtx_error.jpg)

You'll need to turn this on in your system firmware menu. Known systems where
this is necessary are:

- Lenovo:
  [https://support.lenovo.com/au/en/solutions/ht500006](https://support.lenovo.com/au/en/solutions/ht500006
