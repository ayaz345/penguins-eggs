clear
echo "Installing eggs saving time..."
# yolk-restore
sudo rm /var/local/yolk.saved -rf
sudo mv /var/local/yolk /var/local/yolk.saved
# removing eggs
sudo apt purge eggs
sudo dpkg -i perrisbrewery/workdir/eggs_*_amd64.deb
sudo eggs dad -d
# yolk-restore
sudo rm /var/local/yolk -rf
sudo mv /var/local/yolk.saved /var/local/yolk

