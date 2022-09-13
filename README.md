# aspire-budget-automation
Automating simple tasks with the spreadsheet.

# Goal
The goal of this project is to make Aspire Budget easier to use.
Aspire Budget is spreadsheet based and it is by default easy to modify. However, some tasks require you to be very careful how you go about them. For example, you cannot just remove a category once it's been used as it will skew your reports. You can't just rename a category in the configuration screen as it will break report screens, and even worse, break any transfers to/from that category.
The Aspire Budget documentation explains this well and gives very detailed instruction on how to go about these types of changes. I've gone ahead and packed them into an add-on and added a simple interface. I found that by using this I do not lose my train of thought when going over my budget.

![All available automated features](/screenshots/1MenuOptions.png)


## Add category
Aspire Budget makes it very easy to add a category. To make life super easy, I've added a button that does all the copy pasting of rows for you. Add a category at any position in your configuration screen.

![Adding category dialog](/screenshots/2AddCategory1.png)
![Adding category dialog](/screenshots/2AddCategory2.png)

## Rename category
Renaming a category requires you to change the name in various places. This can become painful and very repetitive. The name needs to change in the configuration tab, the category transfer and transactions tabs, and all report tabs. I've added a button that does all that and follows Aspire Budget's documentation to the dot.
https://www.youtube.com/watch?v=GMy66SBKbjk

![Renaming category dialog](/screenshots/3RenameCategory.png)

## Delete category
Deleting a category is relatively straight forward but can be distracting then you are following a train of thought or are in the middle of a conversation. Copy/pasting rows in the configuration screen and remembering to add the category to the hidden categories list. Instead, I've added a button that automates all lot of that. 
See the documentation to learn about hidden categories: https://www.youtube.com/watch?v=7z3wddxxpCE

![Deleting a category dialog](/screenshots/4DeleteCategory.png)



# Installation
I've tested this profusely locally in my spreadsheets and various configurations, however there may still be issues that I have not detected. Please create a backup of your sheets before installing this. When the scripts are more widely tested I will make it available on the Marketplace. Until then, installation can only be done by copy/pasting the code into your Apps Script project.

1) Download the latest version from GitHub: https://github.com/bloggi85/aspire-budget-automation/archive/refs/heads/main.zip
2) Extract, the files.
3) Log into your Aspire spreadsheet
4) Go to Extensions > Apps Script
5) On the left side, click the +
6) Re-create the .html and .cs files from the zip file (copy/pasting the code)
7) Reload your Aspire budget. The "Budget Tools" menu should appear automatically.
