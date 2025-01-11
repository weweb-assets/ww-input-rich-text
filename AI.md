---
name: ww-input-rich-text
description: >-
  The `ww-input-rich-text` component is a versatile rich text editor that
  enables users to create and style text content with extensive formatting
  options, including headings, lists, tables, and media, while offering
  customization features such as read-only mode, mention support, and output
  format selection.
keywords:
  - rich text editor
  - text formatting
  - customizable editor
  - mention feature
  - multi-language support
  - html output
  - markdown output
  - debounce event
  - custom menu
  - weweb integration
---

#### ww-input-rich-text

1. **Component Purpose:** This component renders a rich text editor with various formatting options and customization capabilities. It allows users to create, edit and style text content with features like headings, bold, italic, underline, text alignment, color, lists, tables, links, images, code blocks, and quotes.

2. **Properties:**
   - `readonly`: `boolean` - Whether the rich text editor is read-only or not. Default: `false`.
   - `editable`: `boolean` - Whether the rich text editor is editable or not. Default: `true`.
   - `initialValue`: `string` - The initial value or content of the rich text editor. Default: `""`.
   - `placeholder`: `string` - The placeholder text to display when the editor is empty. Default: `"Type here..."`. It's not an object.
   - `enableMention`: `boolean` - Whether to enable the mention feature or not. Default: `false`.
   - `mentionChar`: `string` - The character that triggers the mention suggestion. Default: `"@"`.
   - `mentionAllowSpaces`: `boolean` - Whether to allow spaces in mentions or not. Default: `false`.
   - `mentionListLength`: `number` - The maximum number of mention suggestions to display. Default: `5`.
   - `autofocus`: `boolean` - Whether to automatically focus the rich text editor or not. Default: `false`.
   - `output`: `'html' | 'markdown'` - The output format of the rich text editor content. Default: `"html"`.
   - `debounce`: `boolean` - Whether to debounce the 'change' event or not. Default: `false`.
   - `debounceDelay`: `string` - The debounce delay for the 'change' event (in milliseconds, between 1 and 5000). Default: `"500ms"`.
   - `hideMenu`: `boolean` - Whether to hide the formatting menu or not. Default: `false`.
   - `wrapMenu`: `boolean` - Whether to wrap the formatting menu or not. Default: `false`.
   - `customMenu`: `boolean` - Whether to use a custom menu or not. Default: `false`.
   - `menuColor`: `string` - The color of the formatting menu. Default: `"#000000ad"`.

3. **Children Components:**
   - `customMenuElement`: `ww-flexbox` - An optionnal specific menu element that can be added to existing menu

4. **Special Features:**
   - Supports multi-language support for placeholders and options.
   - Allows customization of various text styles (font size, font family, font weight, text alignment, color, line height, margins) for different heading levels (h1, h2, h3, h4, h5, h6), paragraphs, links, blockquotes, code blocks, mentions, and tables.
   - Provides options to show/hide different formatting features like bold, italic, underline, text alignment, text color, lists (bullet, ordered, task), tables, links, images, code blocks, and quotes.
   - Integrates with the WeWeb editor for seamless customization and configuration.