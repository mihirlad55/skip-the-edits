# How To Use Git

There are several shell script files premade which you can run on C9 to perform the most common Git Operations.

# How to Run a .sh (Shell Script) File

1. On C9, find the .sh file.
2. Right click on the .sh file
3. Click Run

# What is a Commit?

A commit is the technical term for a change when using Git. Every commit has an associated SHA Hash which is its unique ID within the repository. It is 7 characters and written in hexadecimal. i.e. 3f4fd92 is a SHA Hash code.

# Pulling in Commits (Pull.sh)

Pull means to retrieve the latest commits from the server. Running the pull.sh file will automatically retrieve any changes on the server.

# Making a Commit (Commit.sh)

The commit.sh shell script will push whatever saved changes you have since the last time you've pushed changes. If a change has been made, a nano editor will pop up in the console. At the bottom of the console, the first line will be a one-line summary of the changes and should be no more than about 60 characters. The rest of the lines after that first line will be a more detailed account of the changes made in this commit. After you are finished writing the commit message, you can press Ctrl + Z to exit the nano editor. It will prompt you if you want to save your changes. Press "y". It will then ask you if you want to rename the file, leave it as it is, and just press enter. 

If you want to cancel the commit without making any changes, simply save the file without making any changes to the commit message in the nano editor.

# Reverting a Commit (RevertCommit.sh)

This is where the beauty of Git comes in. By running this shell script, you can remove a specific commit from the past. Simply run the shell script and then write the 7 character SHA Hash code of the commit and press enter. The Nano editor will once again pop up in the console where you can detail the change you just made and why you made it. After you are finished writing the commit message, you can press Ctrl + Z to exit the nano editor. It will prompt you if you want to save your changes. Press "y". It will then ask you if you want to rename the file, leave it as it is, and just press enter.

If you want to cancel the commit without making any changes, simply save the file without making any changes to the commit message in the nano editor.
