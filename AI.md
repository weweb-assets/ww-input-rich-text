---
name: ww-input-rich-text
description: A versatile rich text editor enabling text content creation with formatting options, headings, lists, tables, media, read-only mode, mention support, and output format selection.
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

Properties:
- readonly: boolean - Whether editor is read-only. Default: false
- editable: boolean - Whether editor is editable. Default: true
- initialValue: string - Initial content. Default: ""
- placeholder: string - Placeholder text. Default: "Type here..."
- enableMention: boolean - Enable mention feature. Default: false
- mentionChar: string - Mention trigger character. Default: "@"
- mentionAllowSpaces: boolean - Allow spaces in mentions. Default: false
- mentionListLength: number - Max mention suggestions. Default: 5
- autofocus: boolean - Auto focus editor. Default: false
- output: 'html' | 'markdown' - Output format. Default: "html"
- debounce: boolean - Debounce change event. Default: false
- debounceDelay: string - Debounce delay (1-5000ms). Default: "500ms"
- hideMenu: boolean - Hide formatting menu. Default: false
- wrapMenu: boolean - Wrap formatting menu. Default: false
- customMenu: boolean - Use custom menu. Default: false
- menuColor: string - Menu color. Default: "#000000ad"

Children:
- customMenuElement: ww-flexbox - Optional custom menu element

Events:
- change: {value: string} - Triggered when content changes
- initValueChange: {value: string} - Triggered when initial value changes
- mention:click: {mention: {id: string, label: string}} - Triggered when clicking a mention
- focus: {value: string} - Triggered when editor gets focus
- blur: {value: string} - Triggered when editor loses focus

Variables:
- value: string - Current editor content
- mentions: array - List of mentions in content
- states: object - Editor states (text formatting, alignment, etc)