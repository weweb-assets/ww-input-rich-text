<template>
  <div class="rich-text" v-if="editor" :style="isEditing && 'pointer-events: none;'">
    <div class="rich-text__menu" v-if="content.showMenu" :style="menuStyles">
      <!-- Texte type (normal, ...) -->
      
      <select id="rich-size" v-model="currentTextType">
        <option v-for="option in textTypeOptions" :value="option.value">{{option.label}}</option>
      </select>

      <span class="separator"></span>

      <!-- Bold, Italic, Underline -->
      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <i class="fas fa-bold"></i>
      </button>
      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <i class="fas fa-italic"></i>
      </button>
      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <i class="fas fa-strikethrough"></i>
      </button>

      <span class="separator"></span>
      
      <!-- Color -->
      <label class="rich-text__menu-item" for="rich-color">
        <i class="fas fa-palette"></i>
        <input
          id="rich-color"
          type="color"
          @input="editor.chain().focus().setColor($event.target.value).run()"
          :value="editor.getAttributes('textStyle').color"
          style="display: none;"
        >
      </label>

      <span class="separator"></span>
      
      <!-- List (Bullet, number) -->
      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <i class="fas fa-list-ul"></i>
      </button>
      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        <i class="fas fa-list-ol"></i>
      </button>

      <span class="separator"></span>

      <!-- Tableau -->
      <button class="rich-text__menu-item" @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
        <i class="fas fa-table"></i>
      </button>
      <!-- Code -->
      
      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('code') }">
        <i class="fas fa-code"></i>
      </button>

      <button class="rich-text__menu-item" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        <i class="fas fa-quote-left"></i>
      </button>

      <span class="separator"></span>

      <button class="rich-text__menu-item" @click="editor.chain().focus().undo().run()">
         <i class="fas fa-undo"></i>
      </button>
      <button class="rich-text__menu-item" @click="editor.chain().focus().redo().run()">
         <i class="fas fa-redo"></i>
      </button>
    </div>
    <editor-content :editor="editor" :style="richStyles"/>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import suggestion from './suggestion.js'
import { computed } from 'vue'

function extractMentions (acc, currentNode) {
  if (currentNode.type === 'mention') {
    acc.push(currentNode.attrs.id)
    return acc
  } else if (currentNode.content) {
    return currentNode.content.reduce(extractMentions, acc)
  } else {
    return acc
  }
}

export default {
  components: {
    EditorContent,
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props) {
    const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: 'string',
      defaultValue: String(props.content.initialValue || ''),
    });

    const { value: variableMentions, setValue: setMentions } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'mentions',
      type: 'array',
      defaultValue: [],
      readonly: true
    });

    return { variableValue, setValue, variableMentions, setMentions }
  },
  data: () => ({
    editor: null,
    loading: false,
  }),
  
  watch: {
    // 'content.editable'(value) {
    //   this.editor.setEditable(value)
    // },
    'content.initialValue'(value) {
      this.editor.commands.setContent(value)
      this.$emit('trigger-event', { name: 'initValueChange', event: { value } });
    },
    'content.editable'(value) {
      this.editor.setEditable(value)
    },
    'variableValue'(value) {
      this.editor.commands.setContent(value)
    },
    /* wwEditor:start */
    editorConfig() {
      this.loadEditor()
    },
    /* wwEditor:end */
  },
  computed: {
    isEditing() {
      /* wwEditor:start */
      return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
    editorConfig() {
      return {
        content: String(this.content.initialValue || ''),
        placeholder: this.content.placeholder,
        editable: this.content.editable,
        autofocus: this.content.autofocus,
        mention: {
          enabled: this.content.enableMention,
          list: this.content.mentionList,
          allowSpaces: this.content.mentionAllowSpaces,
          char: this.content.mentionChar
        }
      }
    },
    currentTextType: {
      get() {
        const currentType = this.textTypeOptions.find(option => option.active)
        return currentType ? currentType.value : 0
      },
      set(value) {
        if(value === 0) this.editor.chain().focus().setParagraph().run()
        if(value !== 0) this.editor.chain().focus().toggleHeading({ level: Number(value) }).run()
      }
    },
    textTypeOptions() {
      return [
        {label: 'Paragraph', value: 0, active: this.editor.isActive('paragraph')}, 
        {label: 'Heading 1', value: 1, active: this.editor.isActive('heading', { level: 1 })}, 
        {label: 'Heading 2', value: 2, active: this.editor.isActive('heading', { level: 2 })},
        {label: 'Heading 3', value: 3, active: this.editor.isActive('heading', { level: 3 })},
        {label: 'Heading 4', value: 4, active: this.editor.isActive('heading', { level: 4 })},
        {label: 'Heading 5', value: 5, active: this.editor.isActive('heading', { level: 5 })},
        {label: 'Heading 6', value: 6, active: this.editor.isActive('heading', { level: 6 })}
      ]
    },
    menuStyles() {
      return {
        '--menu-color': this.content.menuColor,
      }
    },
    richStyles() {
      return {
        '--rich-link-color': this.content.linkColor,
        '--rich-mention-color': this.content.mentionColor
      }
    },
  },
  methods: {
    loadEditor() {
      if (this.loading) return
      this.loading = true
      if (this.editor) this.editor.destroy()
      this.editor = new Editor({
        content: this.editorConfig.content,
        editable: this.editorConfig.editable,
        autofocus: this.editorConfig.autofocus,
        extensions: [
          StarterKit,
          Table,
          TableRow,
          TableHeader,
          TableCell,
          Link,
          TextStyle,
          Color,
          Placeholder.configure({
            placeholder: this.editorConfig.placeholder,
          }),
          this.editorConfig.mention.enabled && Mention.configure({
            HTMLAttributes: {
              class: 'mention',
            },
            suggestion: {
              items: ({ query }) => this.editorConfig.mention.list.filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5),
              render: suggestion.render,
              allowSpaces: this.editorConfig.mention.allowSpaces,
              char: this.editorConfig.mention.char
            }
          })
        ],
        onCreate: () => {
          this.setValue(this.editor.getHTML())
          this.setMentions(this.editor.getJSON().content.reduce(extractMentions, []))
        },
        onUpdate: () => {
          this.setValue(this.editor.getHTML())
          this.setMentions(this.editor.getJSON().content.reduce(extractMentions, []))
          this.$emit('trigger-event', { name: 'change', event: { value: this.variableValue } });
        },
        editorProps: {
          // TODO : find a workaround for backspace not working on editor
          // handleKeyDown: (view, event) => {},
          handleClickOn: (view, pos, node) => {
            if(node.type.name === 'mention') {
              this.$emit('trigger-event', { name: 'mention:click', event: { mention: node.attrs.id } });
            }
          }
        }
      })
      this.loading = false
    },
  },
  mounted() {
    this.loadEditor()
  },
  beforeUnmount() {
    if(this.editor) this.editor.destroy()
    
  },
};
</script>

<style lang="scss">
.rich-text {
  --menu-color: unset;
  display: flex;
  flex-direction: column;

  .separator {
    background: rgb(235, 236, 240);
    width: 1px;
    height: 24px;
    margin: 0px 8px;
  }

  &__menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4px;
    gap: 4px;
    overflow-x: auto;
    select {
      padding: 8px;
      appearance: none;
      border: none;
      font-weight: 700;
      cursor: pointer;
      color: var(--menu-color);
      &:hover {
        background-color: rgb(245, 245, 245);
      }
    }
    &-item {
      padding: 2px;
      color: var(--menu-color);
      cursor: pointer;
      text-align: center;
      border-radius: 4px;
      i {
        width: 24px;
      }
      &:hover {
        background-color: rgb(245, 245, 245);
      }
      &.is-active {
        color: white;
        background-color: var(--menu-color);
      }
    }
  }
}

/* Basic editor styles */
.ProseMirror {
  --rich-link-color: unset;
  --rich-mention-color: unset;

  cursor: text;
  max-height: 500px;
  overflow: auto;
  padding: 8px;
  &-focused {
    outline: unset;
  }
  > * + * {
    margin-top: 0.75em;
  }

  a {
    color: var(--rich-link-color);
    display: inline;
    text-decoration: underline;
    cursor: pointer;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  .mention {
    border: 1px solid var(--rich-mention-color);
    border-radius: 0.4rem;
    padding: 0.1rem 0.3rem;
    box-decoration-break: clone;
    cursor: pointer;
    color: var(--rich-mention-color);
  }
}

/* Table-specific styling */
.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>
