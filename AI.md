---
name: ww-input-rich-text
description: A versatile rich text editor enabling text content creation with formatting options, headings, lists, tables, media, read-only mode, mention support, and output format selection. This is for editing rich text, not just rendering rich text.
keywords:
  - rich text editor
  - text edition
  - customizable editor
  - mention feature
  - multi-language support
  - markdown input
  - advanced text input
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
- mentionList: array - List of mention suggestions. Default: []
- mentionIdPath: string - Path to mention ID in data. Default: null
- mentionLabelPath: string - Path to mention label in data. Default: null
- autofocus: boolean - Auto focus editor. Default: false
- output: 'html' | 'markdown' - Output format. Default: "html"
- debounce: boolean - Debounce change event. Default: false
- debounceDelay: string - Debounce delay (1-5000ms). Default: "500ms"
- hideMenu: boolean - Hide formatting menu. Default: false
- wrapMenu: boolean - Wrap formatting menu. Default: false
- customMenu: boolean - Use custom menu. Default: false
- menuColor: string - Menu color. Default: "#000000ad"
- fieldName: string - Form field name. Default: ""
- customValidation: boolean - Enable custom validation. Default: false
- validation: string - Custom validation formula. Default: ""
- h1-h6: object - Heading styles (fontSize, fontFamily, fontWeight, etc.)
- p: object - Paragraph styles
- mention: object - Mention styles
- a: object - Link styles
- blockquote: object - Quote styles
- code: object - Code block styles
- img: object - Image styles
- checkbox: object - Checkbox styles
- table: object - Table styles

Children:
- customMenuElement: ww-div - Optional custom menu element

Events:
- change: {value: string} - Triggered when content changes
- initValueChange: {value: string} - Triggered when initial value changes
- mention:click: {mention: {id: string, label: string}} - Triggered when clicking a mention
- focus: {value: string} - Triggered when editor gets focus
- blur: {value: string} - Triggered when editor loses focus

Actions:
- `focusEditor`: Focus the editor. No args allowed
- `setLink`: Set a link. Args: URL (Text)
- `setImage`: Set an image. Args: Source (Text), Alt (Text), Title (Text)
- `setTag`: Set text tag. Args: Tag (select: p, h1, h2, h3, h4, h5, h6)
- `toggleBold`: Toggle bold formatting. No args allowed
- `toggleItalic`: Toggle italic formatting. No args allowed
- `toggleUnderline`: Toggle underline. No args allowed
- `toggleStrike`: Toggle strikethrough. No args allowed
- `setTextAlign`: Set text alignment. Args: Alignment (select: left, center, right, justify)
- `setColor`: Set text color. Args: Color (color)
- `toggleBulletList`: Toggle bullet list. No args allowed
- `toggleOrderedList`: Toggle ordered list. No args allowed
- `toggleTaskList`: Toggle task list. No args allowed
- `toggleCodeBlock`: Toggle code block. No args allowed
- `toggleBlockquote`: Toggle blockquote. No args allowed
- `undo`: Undo last action. No args allowed
- `redo`: Redo last action. No args allowed
- `insertTable`: Insert table. No args allowed
- `insertRow`: Insert row. Args: Position (select: before, after)
- `insertColumn`: Insert column. Args: Position (select: before, after)
- `deleteRow`: Delete row. No args allowed
- `deleteColumn`: Delete column. No args allowed
- `deleteTable`: Delete table. No args allowed

Variables:
- value: string - Current editor content
- mentions: array - List of mentions in content
- states: object - Editor states (text formatting, alignment, etc)

Example:
<elements>
{"uid":"container","tag":"ww-div","name":"Editor Container","styles":{...},"children":{"children":[{"uid":"input_rich_text"}]}}
{"uid":"input_rich_text","tag":"ww-input-rich-text","name":"Rich Text Editor","props":{"default":{"a":{"color":"#16a34a","fontSize":"16px","fontFamily":"","isUnderline":true},"p":{"color":"","fontSize":"16px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"h1":{"color":"","fontSize":"32px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"h2":{"color":"","fontSize":"24px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"h3":{"color":"","fontSize":"19px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"h4":{"color":"","fontSize":"16px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"h5":{"color":"","fontSize":"16px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"h6":{"color":"","fontSize":"16px","marginTop":"","textAlign":"","fontFamily":"","fontWeight":"","lineHeight":"","marginBottom":""},"img":{"inline":false,"maxWidth":"auto","maxHeight":"auto"},"code":{"color":"#FFF","bgColor":"#0D0D0D","fontSize":"13px","paddingX":"16px","paddingY":"12px","borderRadius":"8px"},"table":{"cellColor":"#000","borderColor":"#C7C7C7","borderWidth":"1px","headerColor":"#000","cellPaddingX":"8px","cellPaddingY":"6px","headerBgColor":"#f5f5f5","oddCellBgColor":"#FDFDFD","pairCellBgColor":"#fff"},"output":"markdown","mention":{"color":"#16a34a","fontSize":"14px","borderSize":"1px","fontFamily":"var(--ww-default-font-family, sans-serif)","fontWeight":"500","paddingLeft":"8px","borderRadius":"4px","paddingRight":"8px","backgroundColor":"rgba(22, 163, 74, 0.1)"},"checkbox":{"color":"#000"},"debounce":true,"editable":true,"hideMenu":false,"readonly":false,"wrapMenu":true,"autofocus":true,"fieldName":"","menuColor":"rgba(15, 23, 42, 0.8)","blockquote":{"color":"rgb(153, 153, 153)","marginTop":"6px","borderColor":"rgb(223, 226, 229)","marginBottom":"6px"},"customMenu":false,"validation":"","mentionChar":"@","mentionList":{"__wwtype":"f","code":"variables['b59cb5e1-989b-4ac4-9d60-f394e3ac6807']"},"placeholder":"Start writing your thoughts here...","initialValue":"","debounceDelay":"500ms","enableMention":true,"mentionIdPath":"id","parameterBold":true,"parameterLink":true,"parameterRedo":true,"parameterUndo":true,"parameterImage":false,"parameterQuote":true,"parameterTable":true,"parameterItalic":true,"parameterStrike":true,"customValidation":false,"mentionLabelPath":"name","mentionListLength":5,"parameterTaskList":false,"parameterTextType":true,"mentionAllowSpaces":true,"mentionSuggestions":{"code":"wwFormulas.map(variables['b59cb5e1-989b-4ac4-9d60-f394e3ac6807'], 'id', 'name')","__wwtype":"f"},"parameterAlignLeft":false,"parameterCodeBlock":true,"parameterTextColor":true,"parameterUnderline":true,"parameterAlignRight":false,"parameterBulletList":true,"parameterAlignCenter":false,"parameterOrderedList":true,"parameterAlignJustify":false}},"styles":{"default":{"minHeight":"400px"}},"children":{"customMenuElement":{"uid":"c076bd99-a748-4a50-afa1-203555ef7f80"}}}
{"uid":"c076bd99-a748-4a50-afa1-203555ef7f80","tag":"ww-div"}
</elements>