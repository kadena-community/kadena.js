# Contribute

In this document you can find all the info you need to contribute to the docs.

## Structure of the app

When you have cloned the repo and found this package, you are almost good to go.
run the following

```
pnpm install
```

to run the app on `http://localhost:3000`

```
pnpm dev
```

Most of the files are just there for the application it self.  
For writing the actual docs, the only real important folder is `/src/pages`.
This is basically the root of the application. The folders create the menu
structure you can find in the application it self. Most of the folders in the
`/src/pages` folder are also in the mainheader menu.

Some things to consider:

- `/api` this is not a place to add documentation. This folder is used by the
  application itself, to do REST API calls.
- `/search` is normally also not used to put documentation. Here you can find
  the files for the actual search of the application.

All the other files (especially with the extension `md` or `mdx`) are the actual
documentation files and you can do basically do anything with them

## Adding a page

## Build scripts

There are a couple of build scripts running just before the site is put live.
These scripts help us with importing some docs, identifying issues with the
markdown files etc.

`importAllReadmes.mjs`  
This script will import some documentation from other packages of this repo.

`createDocsTree.mjs`  
This will create a large `json` file with the complete menu structure of the
whole app, together with some extra meta data. This file is super useful in the
app. For instance in finding the next and previous page, so we can use that at
the bottom of the page for easy navigation.

`createSpecs.mjs` This creates the `json` files for the swagger-like pages for
pact and chainweb api documentation.

`detectBrokenLinks.mjs` This will walk through all the documentation and check
all the internal links. To check if they are pointing to an actual file. This
will prevent 404's in our page when documentation is removed or moved to a
different menu/folder.  
It will also check for certain domains that are not allowed anymore. Think about
`pact-language.readthedocs.io` or `medium.com/kadena-io`. Also it will rename
some links (from documentation that was imported) from https://docs.kadena.io to
internal links.

`checkForHeaders.mjs`  
Checks that every page uses at least an h1 header at the top of the page.  
Important for SEO.

`checkAuthors.mjs`  
Blog posts have author information. This script checks that this author
information is valid for our website.

`createSitemap.mjs`  
Creates a sitemap of all the pages and creates a `sitemap.xml`.  
This file is later imported by search engines to know what is needed to be
craweled. Important for SEO.

### What do the build scripts do for you?

SO why are the build scripts for any importance for docs writers?  
The scripts are going through all the docs on run time. Looking for things that
can hur

## Cli

TODO Create a CLI for the docs page

- bootstrap a page
- run build scripts more finegrained (only the import scripts for example)
- can we do something like 'docs-prettier'?

## Adding issues

If there are issues with the docs, or you see room for improvements. You can add
stories to the
[asana board](https://app.asana.com/share/kadena/docs-website/392126137019801/549bac730050e5c629d673df5e0e950f)
backlog or ask the questions in the (docs slack
channel)[https://kadena-io.slack.com/archives/C04QZH1562X].

Sorry these links are for internal Kadena use only. If you want to contribute to
the docs as a communitymember, that would be great of course. We would really
appreciate it. All the things mentioned above should work as expected. And if
you have any questions or suggestions. Found any issues you can put them
(here)[https://github.com/kadena-community/kadena.js/issues]. And we try to
contact you there as soon as possible.
