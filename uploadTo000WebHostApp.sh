#!/bin/bash
while true; do
    lftp -e "glob -a rm -r *; exit" -u skiptheedits,Skiptheedits2018 ftp://files.000webhost.com;
    lftp -e "mirror --exclude 'Git Scripts/' --exclude .gitignore --exclude README.md --exclude .git/ --exclude uploadTo000WebHostApp.sh -R ~/environment/skip-the-edits/ public_html; quit" -u skiptheedits,Skiptheedits2018 ftp://files.000webhost.com; 
    sleep 10m;
done