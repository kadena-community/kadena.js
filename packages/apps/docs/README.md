# Contribute to the docs

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

A new page can be placed anywhere in the `src/pages` tree.  
Be aware that the tree can not be deeper than **3** folders.

Create a `.md` file. The name of the file is also the name of the URL. Make it a
good one. Best is to make it the title of the document. For `spaces`, please use
`-`. Correct file name:

- `new-docs-application.md`
- `new-version-pact.mdx`

Incorrect file name:

- `newDOCSApplication.md`
- `new_pact_version.ts`
- `language reference.tsx`

### Frontmatter

Every `.md` file should start with some meta data about the document. This is
called the frontmatter. For the docs application it looks something like this:

```yaml
---
title: New docs application
subTitle: It's new!
description: The new documentation website is better than ever
menu: New docs
label: New docs
publishDate: 1977-10-13
headerImage: /assets/blog/2020/1_b97oiC8M_ePx83B-PW0Cfg.webp
author: He-man
authorId: h.man
layout: blog
---
```

Lets go over them 1 by 1.  
`title`: the title of the document  
`subTitle`: not required. Only used when on landing page layout. `description`:
a short description on what the page is about. This will be used as meta data
for SEO, but can also be used as an excerpt in the search results.  
`menu`: the name used in the side or header menu's.  
`label`: the name used in the breadcrumbs.  
`publishDate`: not required. only used for blogchain, at the moment. And used to
show the user what date the article was first published.  
`headerImage`: not required. only used for the blogchain as the main header on
top of the article.  
`author`: _depricated_! not required. for blogchain we used to JUST show the
author name.  
`authorID`: not required. replaced the above `author` field. The ID then reads
the author info from the `./src/data/authors.json`  
`layout`: checks what layout the page will use to show the data.  
`tags`: not required. An Array of strings that clarify what the content is
about. It is shown on blogchain pages, but is also used in the search indexing
to get better search results.

### H1

Every page's content should also start with an `h1` header.  
If the `h1` header does not exist, the build scripts will give you a warning.

### Layout

There are a couple of different layouts that can be used in the application.  
`full`, `landing`, `blog`, `home` and `redocly`.

#### Full layout

![the layout](./public/assets/layout_full.png) Most pages will use this layout.
It has the left sidemenu and a table of content on the right. And it has the
most room for the actual content.

#### Landing layout

![the layout](./public/assets/layout_landing.png) If a section needs a special
page landing page, to give it a bit more visibility we can use the landing
layout.  
It has a large header that uses the `title` and `subTitle` from the frontmatter.

#### Blog layout

![the layout](./public/assets/layout_blog.png) This layout is actually only used
for blog posts. It shows the large `headerImage` from the frontmatter, if
available.  
It also shows the author info and `tags` from the frontmatter, if available.
Itdoes not have any sidemenus.

#### Redocly layout

![the layout](./public/assets/layout_redocly.png) Only used for pages that show
swagger API info. Not to be used for other documentation.

#### Home layout

![the layout](./public/assets/layout_home.png) The `home` layout is not really
used together with `md` files. It is only used for landing pages of sections and
the actual home page.  
It has a header that needs to be custom made for that page and we can do with
the rest of the layout what ever we want.

## Moving pages around

Moving a page to another place in the tree is as simple as moving a file
somewhere inside the `src/pages` directory.  
When the build then runs it is automatically is put in the correct position.  
**Important:**

- Renaming a file will ALSO change the URL.
- It could be that some internal links are now broken. You will get a warning
  from the build scripts.
- It could be that some external websites were linking to this page and will now
  get a 404.
  - Please check analytics how many visits does this page get?
  - If the page gets a lot of visits you can at a 301 redirect in
    `next.confing.mjs`.  
    This will redirect all the old links to the new URL.

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

`copyFavIcons.mjs`  
copy all the fav icons from `/common/images/icons` package in the monorepo.

## Cli

The CLI is a TODO.

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
