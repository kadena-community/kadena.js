---
title: Style guide
description: Provides guidelines, conventions, and recommended practices for contributing to Kadena documentation.
keywords:
  - documentation
  - contributor guidelines
  - conventions
  - community
  - writing style
---

This guide describes our approach to building effective documentation, the conventions we follow, and the recommended practices for organizing, crafting, and evolving our information architecture with a clear and consistent voice.

Many style rules have equally justifiable alternatives. 
Following a common style guide is intended to prevent debates over style from getting in the way of documenting Kadena. 
If you don't see an answer to a style question in this guide, follow your best judgement and keep the style you choose consistent within the page or document you're working on.

## Organizing information into purpose-driven documents

For software documentation, you can structure information using the following information model:

- **Tutorials** are learning oriented and designed to give a newcomer a positive, successful experience. 
  Tutorials should be tested regularly to ensure they don't get stale and that they always provide a successful result.
- **How-to guides** are task oriented with practical steps to achieve a specific goal. 
  These guides assume that readers are know the task they want to complete for a specific scenario but not necessarily how to complete it.
- **References** are information oriented technical descriptions of a system or its components.
- **Explanations** are the conceptual framework for understanding how or why a system works.
  Explanation provide the context that surrounds what people learn in a tutorial, do in a how-to guide, or look up in reference material.

For more detailed information and examples of how to structure documentation using this 
information model, see [The Grand Unified Theory of Documentation](https://documentation.divio.com/).

## Structuring content into pages

In general, every page of documentation should have a purpose and be self-contained. 
It's okay for information to be in multiple places and similar content can exist in pages that serve different purposes. 
For example, you might have conceptual information about secret and public keys in one page and have similar content as context in a how-to topic for generating keys.
When possible, you should reuse content rather than duplicate content, but it's perfectly fine to cover the same information in more than one place to serve different purposes.

## How-to guides

A how-to guide describes how to achieve a goal or complete a task. 
Only the information that is pertinent to achieving that goal or completing the task is included. 
With how-to guides, readers have enough information to know what they want to do—for example, open a bank account—but not necessarily enough information to know how to do it.
For example, the how-to guide for opening a bank account wouldn't explain what a bank account is or why you might want to open one, but would focus on specific steps such as:

1. Select an institution.
1. Fill out an application.
1. Deposit a minimum amount of currency.
 
How-to guides often include links to additional information, but should not include explanations that take the focus away from what the reader wants to accomplish.

### What's in a how-to guide?

In most cases, how-to guides contain the following sections:

- Frontmatter with a title, description, and other information.
  The title should be short and identify the subject of the how-to topic in the fewest words possible.
  The description should be a sentence that summarizes the content of the topic.
  Additional information might include a list of keywords or the location of the source file.

- One or more introductory paragraphs that explain what the task-at-hand is, the use case or scenario driving the reader to complete the task, and the expected outcome.

- A "Before you begin" list of prerequisites.
  Prerequisites can include what you need to do, what you need know, or what you need to have before starting a procedure.
  For example, if completing a procedure requires the reader to have specific software installed, you should include a description of the software requirement in the "Before you begin" section.

- Task step sections that break down the how-to procedure into manageable chunks or subtasks with clearly-defined goals.
  If you're documenting a simple task that can be completed in less than ten steps, you can probably skip breaking it down into more atomic task sections.
  However, most how-to procedures benefit from being split into subtasks with fewer steps in each is subtask. 
  If a procedure is more than ten steps, you should consider using task step sections.

  Steps in subtask sections should specify the action the reader should take.
  In most cases, steps should also describe the result the reader should expect after taking action.

- A "Next steps" section can be used to add links to logically related topics, if applicable, or
  to recommend related topics for further reading, such as reference topics related to the
  procedure completed.

### Using links, admonishments, and details in how-to guides

You should avoid breaking the reader's focus in how-to guides. 
For example, avoid adding links to other pages or to other sections in the same topic.
Avoid inserting notices, tips, admonishments, or other stylized and potentially distracting components unless absolutely necessary.

If you include links to external documentation, explain why the reason to go there or what information the reader should expect to find there.
For example, use explicit information like "For more information about launching an EC2 instance, see Launch your instance in the AWS documentation" instead of "Read the AWS documentation for more information".

## Tutorials

Tutorials are designed to give first-time users or new developers hands-on experience completing a set of explicit instructions. 
Tutorials should be as simple and straightforward as possible, with one or more clear objectives that are consistently achievable. 
Tutorials must provide a positive learning experience and a successful outcome with no unexpected behavior or unexplained errors. 
It's okay for a tutorial to include a red herring to illustrate a common misstep but the author must provide a sufficient explanation of the error and how to correct it.

### What's in a tutorial?

Tutorials provide information that's similar to how-to guides but are focused on achieving learning objectives.
Typically, a tutorial includes:

- Frontmatter with a title, description, and other information. 
  A tutorial might also include a link to a video demonstration that covers the same lesson.
  Tutorials can also be tagged with a skill level, estimated time to complete, or topic category.
  For example, tutorials can be assigned a skill level of Beginner, Intermediate, or Advanced or a topic category such as Pact or TypeScript.

- One or more introductory paragraphs that explain what the tutorial demonstrates.
  Introductory information can also include a brief summary of the expected outcome.
  For example, if a tutorial demonstrates how to create a simple calculator application, you can include a brief descriptions of the functions the application is going to support.

- A "Before you begin" list of the tools, knowledge, or skills required to complete the tutorial.
  
- Learning objectives that summarize what the reader will accomplish by completing the tutorial.
  Objectives can be listed under a "Learning objectives" heading, but only if this heading is used consistently for all tutorials.

- Task steps that the reader must follow in sequence to successfully complete the lesson.
  The same rules for task sections and steps for how-to guide apply for tutorials.

- A "Next steps" section is optional because tutorials are often self-contained standalone topics.
  However, you can use a "Next steps" section to add links to logically related topics or to recommend related topics for further reading, such as reference topics related to the lesson just completed.

## Conceptual explanation guides

**Conceptual guides** explain core concepts and how Kadena, Chainweb, and other tools work at system, component, and operational levels.
Conceptual guides can include information about software architecture, blockchain technology, network concepts and protocols, or cryptography.
Conceptual guides explain the "why" and "how" at the foundational level.

### What's in a conceptual guide?

Conceptual guides typically contain the following sections:

- Frontmatter with a guide title, description, and other information.

- Subsections and body paragraphs that explain that explain concepts, components, system operations, and context to help the reader understand what something is, why it's important, and how it works.

- Diagrams to illustrate component relationships, system architecture, or flow of operations.

- Links to related topics, where applicable. 

## Reference manuals

**Reference manuals** describe command-line programs with complete command-line option descriptions and examples, language semantics, API methods, and other technical details.
Reference information is often organized using alphabetic order and presented in lists or tables.
Information should be easy to scan henever possible.

### What's in a reference manual?

Reference manuals typically contain the following sections:

- Frontmatter with a guide title, description, and other information.
  
- One or more introductory paragraphs that explain what information the reference covers.

- Formatted reference information. 
  The format might resemble a `man` page or API description with a common set of sections (name, description, syntax, options, examples, and so on) or the format might use lists or tables to present information.

- Links to related topics, where applicable. 

## General guidance for engaging content

There are three keys to writing content that engages the audience:

- Use the *second person* point of view to directly address the reader.
- Use an *active voice* and *present tense* whenever possible.
- Use a *conversational tone* that is not too formal or too chummy.

### Point of view

In most cases, address the reader directly using imperative sentences (Run the following command) or as _you_ (You can run the following command). 
Because tutorials provide a more guided approach to a topic, using the first person plural—we, us, our, ours—is more commonly accepted than in other types of documentation.
Use the first person point of view sparingly and with intention. 
For example, in a tutorial you might use something like "Let's try that now" for a conversational tone.
However, if you overuse the first person point of view, it can overwhelm the sense of a shared experience and obscure the reader's journey.

Don't use “I” or “me” unless it appears in the text of a user interface element.

Avoid using “we” in documenting a recommended setting or practice. Using “We recommend...” is ambiguous ("we" being who exactly?) and potentially dangerous if something goes wrong. 
If there are industry best practices or recommendations, it's okay to indicate that instead of using the royal or editorial "we" in documentation.

### Passive constructions

In passive constructions, the object on the receiving end of an action is the subject of the sentence:
**This value is used** for the `sid` field in the `ldap` section of the configuration file.

In active constructions, the person or object performing an action is the subject of the sentence:
**You use this value** for the `sid` field in the `ldap` section of the configuration file.

When writing about software, it's often tempting to describe what's happening from the code point of view. 
However, there's almost always a human being with a goal or task to complete who is initiating the activity that the software is executing. 
If you keep this human presence in mind, your writing will be more dynamic, easier to follow, and more interesting to read.

There are situations where a passive sentence structure might be appropriate, but be wary of using it.

### Contractions and conversational tone

Contractions are generally acceptable because they give documentation a more natural conversational tone—at least for English speakers. 
Be conscious of when and why you use contractions.

To keep the tone conversational but concise, adhere to the following guidelines:

- Use simple English words instead of flowery or literary language.
- Use “when” to imply **eventuality** and time. 
- Use "if” to imply the **possibility** of something happening.
- Use “since” to imply a period of time.
- Use “because” to imply cause and result.
- Use “once” to imply something that occurs a single time.
- Use “after” to imply something that occurs each time.
- Avoid dead language words and phrases even if they are generally accepted as English words in practice. 
  For example:

  - Instead of “i.e.”, use “that is” or rewrite the sentence to make the meaning clear without needing extra qualification.
  - Instead of “e.g.”, use “for example”.
  - Instead of “via”, use an appropriate English substitute such as “by”, “through”, "from", or “using”.
  - Instead of “etc.”, use “and so on” or revise the content to make the term unnecessary. 
    For example, revise to use *such as* or *like* followed by an example or two.
  - Instead of “caveat”, use an appropriate English substitute such as “notice”, 
    “caution”, or “warning”.

- Avoid adding unnecessary words or phrases. 
  For example:

  - Instead of “In order to”, just use “to”.
  - Instead of “as well as”, just use “and”.
  - Instead of “and then”, just use “then”.
  - Avoid jargon, colloquialisms, and idiomatic phrases.

- Avoid adverbs and subjective statements. 
  For example:

  - Experienced developers who ~~truly~~ prefer to skip the tutorial...
  - You can ~~quickly~~ test this code is functioning as expected...
  - You can run the following script to ~~easily~~ deploy a cluster...

### Headings

All heading levels should use the following conventions:

- Use sentence case. 
  Sentence case means that only the initial word and proper nouns are capitalized.

- Use active, present tense verbs in headings wherever appropriate, especially in the context of tutorials and how-to guides.

- Use noun phrases for conceptual and reference topics whenever possible.

- Minimize the number of words you include in a heading text whenever possible.

- Avoid generic headings like "Overview" and "Introduction", if possible. 
  Generic headings can be conceptually useful, but they don't add value to the content or the navigational experience.

- Include at least two sentences of content.
  A heading should never be immediately followed by another heading. 
  Avoid using headings strictly for navigation.

### Limit heading levels

As a best practice, avoid building an information hierarchy with more than three heading levels. 
Most content can be effectively organized using two internal heading levels, making it easier to navigate and scan for relevant topics. 

### Topic titles

Avoid using gerunds (verbs ending in "-ing") in titles and headings. 
Procedure titles and headings should answer the question: *What are you trying to do?*

For example, if the answer to *What are you trying to do?* is *I want to create an account*, the article heading should be *Create an account*. 
In most cases, concept and reference topics that aren't related to tasks are named with a noun phrase, such as *Blockchain basics*. 

### Lists

Introduce lists with a heading, a sentence, or a fragment that ends with a colon. 

- Use **bulleted lists** for items that don't need to appear in order.

- Use **numbered lists** only for processes and procedures that must be completed in sequential order.

### Bullets

Use the same bullet type for all items in unordered lists. 
The order of items in a bulleted list can imply importance, but generally all list items are peers. 
Each list item should start with a capital letter and end with a period unless all of the list items are single words or short phrases of no more than four words. 
Use parallel sentence structure in phrasing the items in a list. 
For example, start each item in the list using a noun or a phrase that starts with a verb.

### Numbered steps

Only use numbered paragraphs for steps in procedures. 
If a procedure has more than nine steps, always consider breaking it into subsections with headings. 
Ideally, each procedure or subtask:

- Should be three to six steps.
- Should have minimal embedded paragraphs describing what happens—the result or outcome to expect—in an unnumbered paragraph following the step. 
- Should not have nested sub-steps.

### Pronouns

Use gender-neutral pronouns, like “they” whenever possible. 
Generally, you can change any noun from singular to plural to have subject-verb-pronoun agreement and avoid the use of gender-specific pronouns like “he”, “him”, “his” or “she”, “her”, “hers”. 
Using "they" or "their" with singular nouns is more generally accepted in modern conversational English, but it's rare you to need to use the disagreeing format in documentation.

Be wary of impersonal and potentially ambiguous pronouns such as:

- all, another, any
- each, either
- few, many, neither, none,
- one, other
- same, several, some, such
- this, that, them, these, those

If you use any of these impersonal pronouns, be sure you answer “of what?”, “of which?”, or “as what?” in the sentence. 
Be especially cautious if you start a sentence with an indefinite pronoun like "This" followed by a verb. 
In most cases, the pronoun should be followed by an object.

## Kadena-specific styles

Most of the style suggestions in this guide are general writing recommendations for any type of documentation project. 
The general recommendations aren't specifically focused on documenting Kadena. 
The topics in this section cover style conventions that are specifically for Kadena and Kadena documentation.

### Tone

The tone of different articles might vary depending on the target audience.
However, most topics in documentation should have a neutral conversational tone that delivers technically accurate information.

### Code, commands, and configuration

- Use backticks around inline code and commands.
  For example:

  You can run the `docker info` command to check whether Docker is currently running.

- Use labeled code fence blocks for code snippets so that they render with syntax highlighting and a Copy button. 
  For example:
  
  ```lisp
  (namespace 'free)
  (module hello-world GOVERNANCE
    (defcap GOVERNANCE () true)
    (defun say-hello(name:string)
      (format "Hello, {}! ~ from: ${publicKey}" [name])
    )
  )
  ```

### Diagrams

Use the [Kadena visual library]() to create diagrams with a consistent design language.

### Product names and capitalization

Full product names are treated as proper nouns and capitalized. 
For example, Chainweaver and Pact are proper nouns.
Don't capitalize terms that are common words and not proper nouns.
For example, don't capitalize common terms like server, node, agent, and so on. 
Overuse of capitalization makes text more difficult to read.

### Technical concepts and acronyms

Avoid using acronyms if possible.
If you use acronyms, be consistent and use the same acronym for any given concept, protocol, or process throughout the entire page. 
For example, don't use a combination of "multifactor", "2-factor," "two-factor", "2fa," or "tfa" within a given page.

Always use the full definition followed by the acronym in parentheses before using the acronym thereafter. 
For example, use "Network Level Authentication (NLA)", not "NLA (Network Level Authentication)" or "NLA" on its own without its full definition. 

### Search engine optimization (SEO)

Every page should have a clearly-worded description in the frontmatter. Descriptions should be full sentences and end with a period.
Descriptions should include common keywords related to the subject matter if possible. 

## Terminology and usage conventions

This section covers common terminology, style, and usage questions.
It includes recommended practices for using punctuation, referring to user interface elements, and selecting the right words for the information you're trying to convey. 

### Above and below

Don't use *above* to mean *earlier* or as an adjective preceding a noun (*the above section*) or following a noun (*the code above*). 
Use a hyperlink, or use *previous*, *preceding*, or *earlier*. 
Don't use *below* to mean *later* or as an adjective preceding a noun (*the below section*) or following a noun (*the code below*). 
Use a hyperlink, or use *later* or *the following*. For example: 

- Use the preceding code to display information about the database.
- Use the following code to display information about the database.

### Dates and numbers

Date formats can depend on context, including the location of a computer and a user's preferences. 
In most cases, you can use the DD Mon YYYY or DD Month YYYY format for dates. 
In body text, spell out whole numbers from zero through nine. 
Use numerals for 10 or greater. 
Use commas in numbers with four or more digits. 
Use *more than* instead of *over* (over is a spatial term). 

### Emphasis and user interaction

Use bold formatting for user interface elements that the user interacts with, including:

- Menus and menu commands.
- Field and button labels.
- Options that can be selected in the user interface.

### Images

Diagrams and illustrations can help readers visualize and internalize complex ideas and processes, so use them liberally but with intention. 
Images also help to break up long text flows, but they should always reinforce and reflect the text immediately preceding or immediately following the image.

If you include screenshots, only include the relevant parts of the screen and use callouts to highlight how what is captured in the image is relevant to the text.

Be wary of using diagrams or illustrations that include any information—visual or textual—that is likely to get stale.

### "Log in" and "sign in" terminology

Most Linux distributions and macOS use *log in* to describe how a user initiates an interactive 
session. 
Windows uses *log on*. 
Many modern web-based applications use *sign in*.

- Use *sign in* or *log in* as two words with no hyphen when describing an action (verb usage).
- Use *sign in* and *sign out* as the preferred terminology for actions involving web-based applications unless it contradicts the user interface.
- Use *login* as one word only when it's used as a noun, for example, when using *login* to mean a user profile or an identity.
- Use *log-in* with a hyphen only when modifying a noun, for example, when describing a *log-in window* (adjective usage).

### Optional steps

Use *(Optional)* at the beginning of steps that are optional. For example:

- (Optional) Add a custom field.

### Punctuation and writing mechanics

Use the following guidelines for punctuation marks.

| Punctuation	| Usage
| ----------- | -----
| apostrophe (') | Use in contractions for a conversational tone. Avoid using the possessive form.
| colon (:) | Use a colon at the end of the statement that introduces a procedure, bulleted list, or table.
| comma (,)	| Use a serial comma to separate three or more items in a series, including the item before the conjunction. For example: She bought apples, oranges, and bananas.
| em dash (—)	| Use an em dash (—) to set off a clarifying or parenthetical phrase with more emphasis than parentheses provide. Don't add spaces around an em dash. Don't capitalize the first word after an em dash unless the word is a proper noun.
| exclamation point (!) | Avoid using exclamation points in general and never use more than one.
| semicolons (;) | Don't use semicolons instead of commas to separate items in a list. If you think the content should use semicolons, consider rewriting it into subtopics or an unordered bullet list.
| slashes (/) and backslashes (\)	| Avoid using slashes or backslashes except when documenting paths that require either forward or backward slashes. Never use *and/or* in documentation.

### Software versions

Use *or later* or *and later* to refer to multiple versions of software. For example:

- Firefox 3.6 or later
- Rust compiler, version 1.55.0 and later

### Special notice paragraphs

If there's text that requires more attention than the surrounding body, consider isolating it as a standalone note or tip. 
However, **think twice** before adding any type of special notice components or tabbed boxes. 
These elements can be distracting and too many of them can make the text unreadable. 

Because they are generally **disruptive** to the reader's experience, ask yourself if it is 
really necessary to stop the reader's forward progress by adding a special component. 
In most cases, it's more effective to integrate the information in the main body of the text. 
If you use any special notice components at all, use them sparingly.

**Note**—Indicates neutral or positive information that emphasizes or supplements important points of the main text. 
A note supplies information that may apply only in special cases. 
Examples are memory limitations, equipment configurations, or details that apply to specific versions of a program.

**Tip**—Helps users apply the techniques and procedures described in the text to their specific needs. 
A tip suggests alternative methods that may not be obvious and helps users understand the benefits and capabilities of the product. 
A tip is not essential to the basic understanding of the text.

**Caution**—Advises users that failure to take or avoid a specific action could result in loss of data.

### Tense

Use present tense whenever possible. 
Use past tense only if you must describe something that has already occurred.
Use future tense only if you must describe something that has not yet occurred but can be safely assumed.

### User interface elements

In general, you should avoid referring to user interface elements by describing them as menus, buttons, tabs, dropdown lists, and so on. 
Instead, documentation should always focus on what the audience needs to do or wants to accomplish—that is, the user interaction—and not the widgets displayed on the screen.

When referring to interactions in the user interface, you should generally follow the capitalization that is used for the element unless it is rendered as all capital letters. 
Because using all capitals is typically considered aggressive in text and most user interface elements that use all capital letters are also text that the user interacts with, you can break the *follow the UI* rule and use an initial capital letter.

| Element	| How to use it
| ------- | -------------
| button	| Use bold for the button label. Don't include *button* in the description. For example: Click **Submit**.
| checkbox	| Use *checkbox*, not *box* or *check box*, if you need to refer to a checkbox in the user interface. Use *select* and *clear* with checkboxes, not turn on and turn off, check and uncheck, or unselect and deselect.
| click	| Use *click* to describe taking action on a standalone button. Do not use *click on*. *Click* and *select* are not interchangeable.
| dialog	| If you need to refer to a dialog box, use *dialog*. Don't use *pop-up window*, *dialog box*, or *dialogue box*.
| dropdown	| Use *dropdown* as an adjective, not as a noun. For example, use *dropdown list*.
| menu | Use bold for the menu name and menu item names if the user interacts with them.

### Verb usage

Use the following guidelines for common verbs.

| Verb | How to use it
| ---- | -------------
| can, may, might	| Use the verb *can* when describing ability, capability, or capacity. Avoid using the verb *may* because it implies permission. Use the past tense *might* when describing the possibility or eventuality of an outcome.
| clear	| Use *clear* rather than *deselect* or *unselect* if you have to describe removing a selection from a checkbox.
| displays	| Use the transitive verb *displays* rather than the intransitive verb *appears*. Use displays with a direct object. For example, The command *displays* log messages.
| ensure	| Use *ensure* to mean to make sure or to guarantee. Remember that this is not interchangeable with *assure* (to make confident) and *insure* (to provide insurance).
| enter, type	| Use *enter* to instruct the user to input a value by pressing the Enter or Return key. Use *type* to instruct the user to type a value in a field.
| select	| Use *select* to describe taking action on a menu item, checkbox, or radio button. Note that *click* and *select* are not interchangeable.
| set up, setup	| Use *set up*—two words, no hyphen—when used as a verb. Don't hyphenate. Use *setup*—one word, no hyphen—when used as an adjective or as a noun.
| want, wish	| Use *want* instead of *wish* or *desire* when the user has a choice of actions.

### Word choice

Use the following guidelines to select the right word based on context.

| Word in question | How to use it
| ---------------- | -------------
| affect, effect	| Use *affect* as a verb and use *effect* as a noun.
| allow, enable	| Avoid using software as a point of view and consider rewriting to focus on the human interacting with the software.
| app, application	| Use *application* or *applications* unless there's a specific reason for using the shorthand term *app* or *apps*.
| back-end, front-end	| Using the hyphen in these terms is still more common than not using it. Both forms are acceptable, but for consistency use the hyphen.
| email	| It hasn't been *e-mail* for thirty-plus years. Never use *emails*. Don't use *email* as a verb.
| file name	| Use *file name* as two words, not *filename* unless there's a specific reason for using as one word.
| its, it's	| Use *its* as a possessive meaning belonging to or associated with an object or idea previously mentioned. Because *it* is a vague pronoun, be sure to check that what *it* refers to can be easily identified. Use *it's* only as a contraction for *it is* or *it has*.
| multifactor	| Use *multifactor* without the hyphen for *multifactor authentication*.
| please	| Avoid using *please* in documentation unless there's a specific reason for using it. For example, you might use *please* if quoting the content of a message that asks the user to do something inconvenient.
| that, which	| Use *that* at the beginning of a clause that's necessary for the sentence to make sense. Don't put a comma before that. Don't use *that* when introducing a clause referring to people. Use *who*. Use *which* at the beginning of a clause that adds supporting or parenthetical information to a sentence. If you can omit the clause and the sentence still makes sense, use *which*, and put a comma before it.
| user name, username |	Use *user name* as two words in most cases. However, *username* is acceptable to indicate a user identity profile name.

## Best practices and common mistakes

This section highlights best practices and common mistakes to avoid.

### Make every word count

Concise sentences are easier to read, comprehend, and translate.

- Use simple words with precise meanings.
- Remove words that don't add substance.
- Avoid using passive, weak, or vague verb constructions—like “have been” or “is done”—if possible.

Choose words that have one clear meaning. 
If you use words that can be both nouns and verbs—for example, words like *file*, *post*, *mark*, *screen*, *record*, and *report*—use sentence structure and context to eliminate ambiguity.

When in doubt, choose the simple word or phrase over a more formal or complex one.
Avoid flowery language and unnecessary words whenever possible.
For example:

| Choose this | Instead of this |
| --- | --- |
| use | utilize, make use of |
| remove | extract, take away, eliminate |
| tell | inform, let know |
| to | in order to, as a means to |
| also | in addition |
| connect | establish connectivity |

Avoid adjectives and adverbs—words that describe how, when, or where. 
They're tempting, but rarely add value. 
Unless they're important to the meaning of a statement, leave them out.

### Be consistent

Use one term consistently to represent one concept. 
For example, avoid using overloaded terms like accounts, keys, and wallets interchangeably or ambiguously. 
Use the glossary to standardize how terminology should be used. 
If terminology changes, be prepared to root out old terminology.

### Dangling prepositions

In modern English, it's perfectly acceptable to end a sentence with a preposition. 

- This is something you might be interested in.

### Cross-reference formats

Most cross references should include information that clarifies what the reader can expect to be found in the referenced topic.
For cross references to topics in the Kadena documentation, use the following format:

- For more information about viewing audit logs, see [Troubleshooting](#troubleshooting).

For cross references to external resources, use the title of the destination instead of the URL of the destination. 
Avoid using links to unnamed destinations. 
For example, don't use links like click <ins>here</ins> or see this <ins>article</ins>>.