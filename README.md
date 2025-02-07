# Important!

Before comitting, if you haven't done so already, please edit the Git config and update your name and email address so that BitBucket can associate your name with every commit you make.
You only have to do this once. Do the following:

1. Click **Window** on the menubar at the top.
2. Click the first option which should be **New Terminal**
3. In the terminal, enter the following commands, pressing **Enter** after each one.  
`git config --global user.name "FIRST_NAME LAST_NAME"`  
`git config --global user.email "MY_NAME@example.com"`
4. Make sure you write everything exactly as shown above and replace **FIRST_NAME** with your
first name and **LAST_NAME** with your last name. Replace **MY_NAME@example.com** with your email.

# What is Git?

Git is a version control system for tracking changes in computer files and coordinating work on those files among multiple people.

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

# Pull on C9 Startup

To make C9 automatically pull changes from bitbucket on startup, do the following:

1. Click on "AWS Cloud9" in the top left corner
2. Click on "Open Your Init Script"
3. Copy and paste the following into the Init Script:

```
console.log("begin init script");  
    setTimeout(function() {  
                services.console.show();  
                services.console.open({  
                    editorType: "terminal",  
                    active: true  
                }, function(e, tab) {  
                    tab.editor.write([  
                        "cd ~",  
                        "cd \"environment/skip-the-edits/Git Scripts/\"",  
                        "sh Pull.sh",  
                    ].join(" &&\\\n") + "\n");  
                    console.log("run script");  
                });  
    }, 1000);  
```

Then save changes and press **Ctrl + Enter** for the changes to take effect.

# To Access the MySQL Server

You can access the MySQL Server two ways:
1. C9 PHP Script
2. MySQL Workbench (https://dev.mysql.com/downloads/workbench/)

IPV4 Address of Database: `207.223.160.10`  
Username to Log In to Database: `AWS`  
Password to Log In to Database: `6Jy%J6uWsIXr*t@^`  

**NOTE: For you to be able to access the database, I will need to authorize your IP address.**  

If you are connecting from C9, enter the following command into a terminal:  
`wget http://ipinfo.io/ip -qO -`

If you are using MySQL Workbench, search "what is my ip address" in google, and it will
give you your public IP address.

# SSH URL

git@bitbucket.org:mihirlad55/skip-the-edits.git