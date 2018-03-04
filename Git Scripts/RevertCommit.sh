#!/bin/bash
echo Please Enter the SHA of the commit:
read sha
git revert $sha
