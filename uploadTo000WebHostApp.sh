#!/bin/bash
while true; do
    lftp -e "mirror --exclude 'Git Scripts/' --exclude .gitignore --exclude README.md --exclude .git/ -R ~/environment/skip-the-edits/ public_html; quit" -u skiptheedits,Skiptheedits2018 ftp://files.000webhost.com; 
    sleep 1m;
done