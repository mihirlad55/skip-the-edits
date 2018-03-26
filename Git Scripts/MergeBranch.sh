#!/bin/bash
echo Enter name of branch you want to merge with master:
read branch
git checkout master
git merge $branch