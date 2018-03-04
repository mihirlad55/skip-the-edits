# How To Use Git

There are several shell script files premade which you can run on C9 to perform the most common Git Operations.

# How to Run a .sh (Shell Script) File

1. On C9, find the .sh file.
2. Right click on the .sh file
3. Click Run

# What is a Commit?

A **commit** is the technical term for a change when using Git. Every commit has an associated SHA Hash which is its unique ID within the repository. It is 7 characters and written in hexadecimal. i.e. 3f4fd92 is a SHA Hash code.

# What is a Branch?

A **branch** is exactly what it sounds like. It's separate version of the repository. It allows you to do
everything you normally do, except when you commit your changes, it commits to the branch your working on.
In essence, you can work on the same repository, but on a different version that stays separate from the master 
version. Then, once your happy with the branch and think your ready to update the master branch with the branch
you've been working on, you can merge the two branches together.

# Pulling in Commits (Pull.sh)

**Pull** means to retrieve the latest commits from the server. Running the pull.sh file will automatically
retrieve any changes on the server.

# Making a Commit (Commit.sh)

The **commit.sh** shell script will push whatever saved changes you have since the last time you've pushed
changes. If a change has been made, a nano editor will pop up in the console. At the bottom of the console,
the first line will be a one-line summary of the changes and should be no more than about 60 characters.
The rest of the lines after that first line will be a more detailed account of the changes made in this commit.
After you are finished writing the commit message, you can press **Ctrl + Z** to exit the nano editor. It will prompt
you if you want to save your changes. Press **y**. It will then ask you if you want to rename the file, leave it
as it is, and just press enter. 

If you want to cancel the commit without making any changes, simply save the file without making any changes
to the commit message in the nano editor.

# Reverting a Commit (RevertCommit.sh)

This is where the beauty of Git comes in. By running this shell script, you can remove a specific commit from 
the past. Simply run the shell script and then write the 7 character SHA Hash code of the commit and press enter.
The Nano editor will once again pop up in the console where you can detail the change you just made and why you 
made it. After you are finished writing the commit message, you can press **Ctrl + Z** to exit the nano editor. It 
will prompt you if you want to save your changes. Press **y**. It will then ask you if you want to rename the file, 
leave it as it is, and just press enter.

If you want to cancel the commit without making any changes, simply save the file without making any 
changes to the commit message in the nano editor.

# Creating a Branch (CreateBranch.sh)

To create a new **branch**, simply run the shell script and then enter the name of the branch.

# Switching Branches (SwitchBranch.sh)

To switch onto another branch, simply run the shell script and then enter the name of the branch you want to 
switch on to. The main branch of every git repository is called the **master** branch and has the name "master".

# Merging Branches (MergeBranch.sh)

Once you are satisfied with the changes you've made on your separate branch, you can merge that separate
branch onto the master branch. Simply run the shell script MergeBranch.sh and enter the name of the branch
you want to merge the master branch with.

# Merging Conflicts

If there are some conflicts that arise while committing your changes or merging (which can happen if 
changes are made on two seperate branches and are being merged together), then the commit will fail 
nd git will enter merge mode. The file having the conflicted changes will be marked with a type of notation
that will highlight the difference between the two files, and you will have to manually merge the changes.

The changes that are conflicting and on the master branch will be surrounded by **"<<<<<<<<HEAD"**
and **"========"**. The changes that are conflicting and on the other branch will be surrounded by
something similar to **"======"** and **">>>>>>>>"**

i.e.

<<<<<< HEAD  
This change was made on master  
======  

======  
This change was made on the other branch  
\>\>\>\>\>\>