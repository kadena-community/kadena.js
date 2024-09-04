---
title: Contribute to Kadena documentation
description:
  Follow this guide to learn how you can contribute changes to Kadena documentation directly from GitHub or by setting up a local documentation development environment.
menu: Participate
label: Contribute to documentation
order: 5
layout: full

---

# Contribute to Kadena documentation

Thank you for your interest in contributing to documentation for the Kadena blockchain and the Kadena community.
As a member of the community, you are invited and encouraged to contribute to the ever-evolving technical documentation and to the code base.
There are a lot of ways to get involved.
For example, you can contribute by:

- Submitting issues.
- Offering suggestions for improvements to existing content.
- Adding review comments to existing pull requests.
- Proposing new content.
- Creating new pull requests to fix issues yourself.
- Creating pull request for new content other community members might find useful.

We encourage everyone with an interest in improving Kadena documentation to contribute content, submit issues, and suggest changes. 
This guide describes how you can make changes to the documentation website directly by editing source files or indirectly by requesting updates. 

We value, respect, and appreciate all contributions from the developer community and only ask that you agree to abide by our [Community guidelines](https://www.kadena.io/community-guidelines) and follow these contributor guidelines.

## Before you begin

To follow the steps in this guide, verify the following basic requirements:

- You have a code editor, a GitHub account, and experience using command-line
  programs, including `git` commands and command-line options.

- You are familiar with using Markdown to add formatting elements to plain text
  documents. 
  For information about using Markdown, see the [Markdown Guide](https://www.markdownguide.org/).

- You have the `pnpm` package manager installed.

  Depending on your development environment, you can install `pnpm` using a standalone script or using a package manager. 
  For example, you can run the command `brew install pnpm` or `npm install --global pnpm` to install `pnpm` on your local computer. 
  For more information about installing `pnpm` on different operating systems, see [Installation](https://pnpm.io/installation).

  Run `pnpm --version` to verify that you have `pnpm` installed and the version you are running.

- You have run `pnpm setup` to add `pnpm` to your PATH environment variable and
  updated your terminal to use the new PATH.

## How to contribute

If you want to make a simple fix on an existing page—for example, to fix a typo or make minor changes to a sentence—you can edit documentation pages directly in its GitHub repository.

To edit an existing page:

1. Open [docs.kadena.io](https://docs.kadena.com) and navigate to the page you want to change.
2. Click **Edit this page** to open the page in its GitHub repository.
3. Edit the page in GitHub, then click **Commit changes**.
4. Replace the default commit message with a short description of your change and, optionally, an extended description of the change or why you're proposing the change.
5. Select **Create a new branch for this commit and start a pull request**, then click **Propose changes**.
6. Add any additional information to the title or description of the pull request, then click **Create pull request**.
   
   Your pull request will be reviewed by a Kadena team member and merged, if approved.

## Set up a local development environment

If your contribution is more than a simple change, you'll most likely need to set up a local development environment where you can build and test the documentation that you are proposing to change.
The following steps summarize what you need to do.

To set up a local development environment for contributing to Kadena documentation:

1. Open a terminal shell on your computer.

2. Clone the `kadena-js` repository by running the following command:

   ```code
   git clone https://github.com/kadena-community/kadena.js.git
   ```

   This command clones the entire public repository for the TypeScript and JavaScript tools that enable you to interact with the Kadena ecosystem, including the documentation engine and user interface components.

3. Change to the root of the `kadena-js` repository by running the following
   command:

   ```code
   cd kadena.js
   ```

4. Install the `turbo` virtualization software by running the following command:

   ```
   pnpm install --global turbo
   ```

   After you run this command, your local workspace has everything you need to
   build the documentation locally.

5. Install the workspace dependencies by running the following command:

   ```code
   pnpm install
   ```

   This command installs all of the workspace dependencies used to build the documentation as a web application, including shared user interface components.
   Depending on the stability of website components, you might need to take the following additional steps while you are in the `kadena.js` root directory:

   ```bash
   cd packages/tools/docs-tools && pnpm build
   cd ../../..
   cd packages/libs/kode-ui && pnpm build
   cd ../../..
   cd packages/apps/docs && pnpm run dev
   ```

6. Change to the root of the `docs` application directory by running the following command:

   ```code
   cd kadena.js/packages/apps/docs
   ```

### Explore the information architecture

If you explore the contents of the `docs` directory, you'll see the files and subfolders used to build the documentation as a web application. 
To contribute to documentation, you typically only need to work in the `/packages/apps/docs/src/docs` folder, its subfolders, and individual Markdown (`.md`) pages. 

The `/src/docs` folder includes the files and subfolders that define the structure of the content and the operation of the application. For example:

- `/build` contains information about Kadena tools—such as the Pact smart contract language and the Marmalade token standard—for builders and application developers.
- `/deploy` contains information about deploying and managing Kadena network infrastructure and smart contracts. Information in this section is primarily intended for node operators and smart contract authors.
- `/learn` contains foundational information about blockchains, cryptography, consensus, and Kadena core concepts and terminology.
- `/participate` contains information about community programs and how you can get involved.
- `/reference` provides a central hub for technical reference information about Pact, Marmalade, and other tools.

Within these folders, the Markdown files—files with the `md` extension—contain the documentation content.
After you explore these folders, create a local working branch of the repository for your contribution.

### Explore the site configuration file

The information architecture for the Kadena documentation website is defined using the [config.yaml](https://github.com/kadena-community/kadena.js/blob/main/packages/apps/docs/src/config.yaml) file.
This file controls all of the URLs and files for the topics included in the site.
You should only modify this file if you're adding a new topic to the structure.

## Create working branches and pull requests

After you set up a local environment for contributing to documentation, you'll need to create local branches for your pull requests.
In most cases, you should strictly limit the changes including in any single pull request.

To create a working branch:

1. Use `git switch -c` to create a local branch with a prefix that identifies you as the author and a branch name that describes the content you intend to add or change by running a command similar to the following:

   ```text
   git switch -c my-identifier-prefix/my-branch-name-here
   ``` 
   
   For example, if your `git` handle is `lola-pistola` and you are fixing a typo in the `reference` folder, you might create a branch like this:

   ```code
   git switch -c lola-pistola/typo-reference-db-functions

4. Open the file you want to fix in a code editor and make the appropriate changes for the issue you are trying to address.

5. Add the file you changed to the list of staged commits by running a command similar to the following:
   
   ```text
   git add path-to-changed-file
   ```

6. Commit the staged changes with a descriptive commit message by running a command similar to the following:
   
   ```text
   git commit -m "Description of the fix being committed."
   ```

7. Push the changes to the remote repository by running a command similar to the following:

   ```text
   git push origin my-identifier-prefix/my-branch-name-here
   ```

8. Click **Create pull request** to start a new pull request and provide any additional information about the changes you made.
    
    A member of the Kadena team will review your pull request and approve or request changes.
    If no changes are required, the Kadena team member will merge your pull request.
    If a Kadena team member requests changes or clarification, update your pull request and request another review.

9. When you see your changes have been merged, celebrate your success!
   🥂

## What to contribute

Most contributions from the community typically involve corrections or updated examples.
However, you can also make valuable contributions in the form of how-to guides or tutorials that help other developers solve specific problems, learn specific skills, or demonstrate specific tasks.

If you would like to contribute, you might be wondering “What is the difference between a ‘how-to’ guide and a tutorial?”.

### How-to guides

A how-to guide describes how to achieve a goal or complete a task. 
Only the information that is pertinent to achieving that goal or completing the task is included. 
With how-to guides, readers have enough information to know what they want to do—for example, open a bank account—but not necessarily enough information to know how to do it.
For example, the how-to guide for opening a bank account wouldn't explain what a bank account is or why you might want to open one, but would focus on specific steps such as:

1) Select an institution.
2) Fill out an application.
3) Deposit a minimum amount of currency.

### Tutorials

A tutorial is a hands-on illustration or lesson that enables the reader to achieve a **highly-predictable** result. 
Tutorials assume that readers have no prior knowledge on the subject being covered and that they require explicit guidance to complete each step to reach a **well-known** outcome.
A tutorial is like a guided tour that helps the reader complete one organic task from start to finish. 
For example, a tutorial for opening a bank account would identify an example institution, explicitly describe what to enter for every field of the application using sample information, and specify exactly how much currency to deposit.

The single most important aspect of a tutorial is that it should always result in a successful, expected outcome that inspires confidence and delight in the reader. 

The single most important distinction between a how-to guide and a tutorial is that, in a tutorial, the author decides what the goal should be and the author eliminates all distractions that would detract from the successful achievement of the goal.

