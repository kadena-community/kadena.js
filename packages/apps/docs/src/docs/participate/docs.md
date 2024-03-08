---
title: Contribute to Kadena Docs
description:
  How to contribute to the docs from docs.kadena.io, GitHub, or a local
  environment.
menu: Contribute to documentation
label: Contribute to documentation
order: 5
layout: full
---

# Contribute to Kadena Docs

The Kadena documentation is open source and hosted on GitHub. 
Using our public-facing [Docs](https://github.com/kadena-community/docs) repo in the
[Kadena Community GitHub](https://github.com/kadena-community), you can make
suggested changes using pull requests. This allows community members to improve
the documentation and helps improve the Kadena developer experience.

There are three ways to contribute to Kadena documentation depending on where you are starting
from.

- From the Docs
- From GitHub
- From a Local Environment.

This article goes over each of these options to help you suggest changes to the [Kadena Docs](https://github.com/kadena-community/docs).

## Before Getting Started

**GitHub**

Create a GitHub account [here](https://github.com/) and read their
[documentation](https://docs.github.com/en) if you have trouble getting started.

[github](/assets/docs/1-contribute.png)

**Markdown**

Learn about [Markdown](https://www.markdownguide.org/) to better understand the
syntax for editing documentation.

## Edit from the Docs

At the bottom of any page of the Kadena Documentation, you’ll see a link titled
**Edit this page. **

![github](/assets/docs/4-contribute.png)

Selecting this link takes you to the **kadena-community/docs** editor window for
this page within GitHub.

![github](/assets/docs/5-contribute.png)

Make adjustments as needed and preview your changes using the **Preview tab**.

![github](/assets/docs/6-contribute.png)

Select the **Show diff **checkbox to view the changes inline.

![github](/assets/docs/7-contribute.png)

To propose your changes, scroll to the bottom of the page, add notes about your
changes, and select the radio button option to **Create a new branch**. Name
your branch and select propose changes.

![github](/assets/docs/8-contribute.png)

You have now proposed edits to the repo from the documentation. The Kadena team
will review your request and merge your changes as soon as possible. View your
pull request at any time to see any comments, questions, or suggestions
throughout the duration of your pull request.

## Edit from the GitHub Repo

Navigate to the
[Kadena Community GitHub ](https://github.com/kadena-community)and navigate to
the [Docs Repo](https://github.com/kadena-community/docs).

![github](/assets/docs/9-contribute.png)

Using the folder structure, navigate to the page you would like to edit
(**example: docs/basics/overview.md**).The location of this file corresponds to
the URL found from within the documentation site.

![github](/assets/docs/10-contribute.png)

Select the edit icon on the right side of the screen to begin editing the
document.

![github](/assets/docs/11-contribute.png)

Make adjustments as needed and preview your changes using the **Preview tab**.

![github](/assets/docs/12-contribute.png)

Select the **Show diff **checkbox to view the changes inline.

![github](/assets/docs/13-contribute.png)

To propose your changes, scroll to the bottom of the page, add notes about your
changes, and select the radio button option to **Create a new branch**. Name
your branch and select propose changes.

![github](/assets/docs/14-contribute.png)

You have now proposed edits to the repo from GitHub. The Kadena team will review
your request and merge your changes as soon as possible. View your pull request
at any time to see any comments, questions, or suggestions throughout the
duration of your pull request.

## Edit from a Local Environment

Navigate to [kadena-community/docs](https://github.com/kadena-community/docs)
and select **Fork **on the top right of your screen.

![github](/assets/docs/15-contribute.png)

Select your profile to create a fork of this repo on your personal GitHub
account.

![github](/assets/docs/16-contribute.png)

Navigate to your docs repo fork and copy the URL from the code dropdown.

![github](/assets/docs/17-contribute.png)

Open your terminal, navigate to your preferred folder, and clone the repository.

**Example**

```bash title=" "
git clone https://github.com/kadena-community/docs.git
```

![github](/assets/docs/18-contribute.png)

Change into the **docs/** directory

```bash title=" "
cd docs
```

![github](/assets/docs/19-contribute.png)

Run **yarn** to install the project dependencies.

```bash title=" "
yarn
```

![github](/assets/docs/20-contribute.png)

Run **yarn start** to run the local server.

```bash title=" "
yarn start
```

![github](/assets/docs/21-contribute.png)

Navigate to [localhost:3000](http://localhost:3000/) to view the documentation
on local device.

![github](/assets/docs/22-contribute.png)

Open the **docs **folder in your favorite code editor to make changes to the
documentation (**example:** **docs > basics > what-is-kda.md)**. Use markdown to
edit the page and save the file to view your changes.

![github](/assets/docs/23-contribute.png)

When you are done editing, check the status of your changes from your terminal
window.

```bash title=" "
git status
```

![github](/assets/docs/24-contribute.png)

Use **git add **to add stage your changes to commit to your local repository.

```bash title=" "
git add .
```

![github](/assets/docs/25-contribute.png)

Use **git commit **to commit your changes to your local repository.

```bash title=" "
git commit -m 'how to edit docs'
```

![github](/assets/docs/26-contribute.png)

Use **git push **to push your changes to your remote repository.

```bash title=" "
git push origin main
```

![github](/assets/docs/27-contribute.png)

Select **Contribute > Open pull request** from within your remote repository.

![github](/assets/docs/28-contribute.png)

You have now created a pull request to the repo from a local environment. The
Kadena team will review your request and merge your changes as soon as possible.
View your pull request at any time to see any comments, questions, or
suggestions throughout the duration of your pull request.
