#!/bin/bash
echo Enter the name of the branch you want to create and switch to:
read branch
git checkout -b $branch