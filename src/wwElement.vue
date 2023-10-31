<template>
    <div
        class="ww-rich-text"
        :class="{ '-readonly': isReadonly }"
        :style="isEditing && 'pointer-events: none;'"
        data-capture
    >
        <template v-if="richEditor">
            <div class="ww-rich-text__menu" v-if="!hideMenu && !content.customMenu" :style="menuStyles">
                <!-- Texte type (normal, ...) -->
                <select id="rich-size" v-model="currentTextType" :disabled="!isEditable">
                    <option v-for="option in textTypeOptions" :value="option.value">{{ option.label }}</option>
                </select>

                <span class="separator"></span>

                <!-- Bold, Italic, Underline -->
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleBold"
                    :class="{ 'is-active': richEditor.isActive('bold') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-bold"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleItalic"
                    :class="{ 'is-active': richEditor.isActive('italic') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-italic"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleUnderline"
                    :class="{ 'is-active': richEditor.isActive('underline') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-underline"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleStrike"
                    :class="{ 'is-active': richEditor.isActive('strike') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-strikethrough"></i>
                </button>

                <span class="separator"></span>

                <!-- Color -->
                <label class="ww-rich-text__menu-item" for="rich-color" @click="richEditor.commands.focus()">
                    <i class="fas fa-palette"></i>
                    <input
                        id="rich-color"
                        type="color"
                        @input="setColor($event.target.value)"
                        :value="richEditor.getAttributes('textStyle').color"
                        style="display: none"
                        :disabled="!isEditable"
                    />
                </label>

                <span class="separator"></span>

                <!-- List (Bullet, number) -->
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleBulletList"
                    :class="{ 'is-active': richEditor.isActive('bulletList') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-list-ul"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleOrderedList"
                    :class="{ 'is-active': richEditor.isActive('orderedList') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-list-ol"></i>
                </button>

                <span class="separator"></span>

                <!-- Link -->
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="setLink()"
                    :class="{ 'is-active': richEditor.isActive('link') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-link"></i>
                </button>

                <!-- Code -->
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleCodeBlock"
                    :class="{ 'is-active': richEditor.isActive('code') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-code"></i>
                </button>

                <!-- Quote -->
                <button
                    type="button"
                    class="ww-rich-text__menu-item"
                    @click="toggleBlockquote"
                    :class="{ 'is-active': richEditor.isActive('blockquote') }"
                    :disabled="!isEditable"
                >
                    <i class="fas fa-quote-left"></i>
                </button>

                <span class="separator"></span>

                <!-- Undo/Redo -->
                <button type="button" class="ww-rich-text__menu-item" @click="undo" :disabled="!isEditable">
                    <i class="fas fa-undo"></i>
                </button>
                <button type="button" class="ww-rich-text__menu-item" @click="redo" :disabled="!isEditable">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
            <wwElement class="ww-rich-text__menu" v-else-if="content.customMenu" v-bind="content.customMenuElement" />
            <editor-content :editor="richEditor" :style="richStyles" />
        </template>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align'
import { Markdown } from 'tiptap-markdown';
import { computed } from 'vue';
import suggestion from './suggestion.js';

function extractMentions(acc, currentNode) {
    if (currentNode.type === 'mention') {
        acc.push(currentNode.attrs.id);
        return acc;
    } else if (currentNode.content) {
        return currentNode.content.reduce(extractMentions, acc);
    } else {
        return acc;
    }
}

const TAGS_MAP = {
    p: 0,
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
};

export default {
    components: {
        EditorContent,
    },
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['trigger-event', 'update:content:effect', 'update:sidepanel-content'],
    setup(props, { emit }) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: 'string',
            defaultValue: computed(() => String(props.content.initialValue || '')),
        });

        const { value: variableMentions, setValue: setMentions } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'mentions',
            type: 'array',
            defaultValue: [],
            readonly: true,
        });

        return {
            variableValue,
            setValue,
            variableMentions,
            setMentions,
        };
    },
    data: () => ({
        richEditor: null,
        loading: false,
    }),

    watch: {
        'content.initialValue'(value) {
            if (value !== this.getContent()) this.richEditor.commands.setContent(value);
            this.$emit('trigger-event', { name: 'initValueChange', event: { value } });
        },
        isEditable(value) {
            this.richEditor.setEditable(value);
        },
        variableValue(value, oldValue) {
            if (value !== this.getContent()) this.richEditor.commands.setContent(value);
        },
        /* wwEditor:start */
        editorConfig() {
            this.loadEditor();
        },
        'wwEditorState.boundProps.mentionList'(isBind) {
            if (!isBind)
                this.$emit('update:content:effect', {
                    mentionIdPath: null,
                    mentionLabelPath: null,
                });
        },
        // For updating legacy elements before introduction of custom menu
        'content.customMenu': {
            async handler(value) {
                if (value && !this.content.customMenuElement) {
                    const element = await wwLib.createElement(
                        'ww-flexbox',
                        {},
                        {
                            name: 'Custom menu container',
                            style: {
                                default: {
                                    width: '100%',
                                },
                            },
                        },
                        this.wwFrontState.sectionId
                    );
                    this.$emit('update:content:effect', {
                        customMenuElement: element,
                    });
                }
            },
            immediate: true,
        },
        'wwEditorState.isSelected'() {
            this.$emit('update:sidepanel-content', { path: 'selectedTag', value: null });
        },
        /* wwEditor:end */
        isReadonly: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'readonly');
                } else {
                    this.$emit('remove-state', 'readonly');
                }
            },
        },
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        mentionList() {
            const data = wwLib.wwCollection.getCollectionData(this.content.mentionList);
            if (!Array.isArray(data)) return [];
            return data.map(mention => ({
                id: wwLib.resolveObjectPropertyPath(mention, this.content.mentionIdPath || 'id') || '',
                label: wwLib.resolveObjectPropertyPath(mention, this.content.mentionLabelPath || 'label') || '',
            }));
        },
        mentionListLength() {
            if (!this.content.mentionListLength || isNaN(this.content.mentionListLength)) return 5;
            return this.content.mentionListLength;
        },
        isReadonly() {
            return this.wwElementState.props.readonly === undefined
                ? this.content.readonly
                : this.wwElementState.props.readonly;
        },
        isEditable() {
            return !this.isReadonly && this.content.editable;
        },
        hideMenu() {
            return this.content.hideMenu || this.isReadonly;
        },
        editorConfig() {
            return {
                placeholder: this.content.placeholder,
                autofocus: this.content.autofocus,
                image: {
                    inline: this.content.img?.inline,
                    allowBase64: true,
                },
                mention: {
                    enabled: this.content.enableMention,
                    list: this.mentionList,
                    allowSpaces: this.content.mentionAllowSpaces,
                    char: this.content.mentionChar,
                },
            };
        },
        currentTextType: {
            get() {
                const currentType = this.textTypeOptions.find(option => option.active);
                return currentType ? currentType.value : 0;
            },
            set(value) {
                this.setTag(value);
            },
        },
        textTypeOptions() {
            if (!this.richEditor) return [];
            return [
                { label: 'Paragraph', value: 0, active: this.richEditor.isActive('paragraph') },
                { label: 'Heading 1', value: 1, active: this.richEditor.isActive('heading', { level: 1 }) },
                { label: 'Heading 2', value: 2, active: this.richEditor.isActive('heading', { level: 2 }) },
                { label: 'Heading 3', value: 3, active: this.richEditor.isActive('heading', { level: 3 }) },
                { label: 'Heading 4', value: 4, active: this.richEditor.isActive('heading', { level: 4 }) },
                { label: 'Heading 5', value: 5, active: this.richEditor.isActive('heading', { level: 5 }) },
                { label: 'Heading 6', value: 6, active: this.richEditor.isActive('heading', { level: 6 }) },
            ];
        },
        menuStyles() {
            return {
                '--menu-color': this.content.menuColor,
            };
        },
        richStyles() {
            return {
                overflow: 'auto',
                // H1
                '--h1-fontSize': this.content.h1.fontSize,
                '--h1-fontFamily': this.content.h1.fontFamily,
                '--h1-fontWeight': this.content.h1.fontWeight,
                '--h1-textAlign': this.content.h1.textAlign,
                '--h1-color': this.content.h1.color,
                '--h1-lineHeight': this.content.h1.lineHeight,
                '--h1-margin-top': this.content.h1.marginTop,
                '--h1-margin-bottom': this.content.h1.marginBottom,
                // H2
                '--h2-fontSize': this.content.h2.fontSize,
                '--h2-fontFamily': this.content.h2.fontFamily,
                '--h2-fontWeight': this.content.h2.fontWeight,
                '--h2-textAlign': this.content.h2.textAlign,
                '--h2-color': this.content.h2.color,
                '--h2-lineHeight': this.content.h2.lineHeight,
                '--h2-margin-top': this.content.h2.marginTop,
                '--h2-margin-bottom': this.content.h2.marginBottom,
                // H3
                '--h3-fontSize': this.content.h3.fontSize,
                '--h3-fontFamily': this.content.h3.fontFamily,
                '--h3-fontWeight': this.content.h3.fontWeight,
                '--h3-textAlign': this.content.h3.textAlign,
                '--h3-color': this.content.h3.color,
                '--h3-lineHeight': this.content.h3.lineHeight,
                '--h3-margin-top': this.content.h3.marginTop,
                '--h3-margin-bottom': this.content.h3.marginBottom,
                // H4
                '--h4-fontSize': this.content.h4.fontSize,
                '--h4-fontFamily': this.content.h4.fontFamily,
                '--h4-fontWeight': this.content.h4.fontWeight,
                '--h4-textAlign': this.content.h4.textAlign,
                '--h4-color': this.content.h4.color,
                '--h4-lineHeight': this.content.h4.lineHeight,
                '--h4-margin-top': this.content.h4.marginTop,
                '--h4-margin-bottom': this.content.h4.marginBottom,
                // H5
                '--h5-fontSize': this.content.h5.fontSize,
                '--h5-fontFamily': this.content.h5.fontFamily,
                '--h5-fontWeight': this.content.h5.fontWeight,
                '--h5-textAlign': this.content.h5.textAlign,
                '--h5-color': this.content.h5.color,
                '--h5-lineHeight': this.content.h5.lineHeight,
                '--h5-margin-top': this.content.h5.marginTop,
                '--h5-margin-bottom': this.content.h5.marginBottom,
                // H6
                '--h6-fontSize': this.content.h6.fontSize,
                '--h6-fontFamily': this.content.h6.fontFamily,
                '--h6-fontWeight': this.content.h6.fontWeight,
                '--h6-textAlign': this.content.h6.textAlign,
                '--h6-color': this.content.h6.color,
                '--h6-lineHeight': this.content.h6.lineHeight,
                '--h6-margin-top': this.content.h6.marginTop,
                '--h6-margin-bottom': this.content.h6.marginBottom,
                // p
                '--p-fontSize': this.content.p.fontSize,
                '--p-fontFamily': this.content.p.fontFamily,
                '--p-fontWeight': this.content.p.fontWeight,
                '--p-textAlign': this.content.p.textAlign,
                '--p-color': this.content.p.color,
                '--p-lineHeight': this.content.p.lineHeight,
                '--p-margin-top': this.content.p.marginTop,
                '--p-margin-bottom': this.content.p.marginBottom,
                // mention
                '--mention-fontSize': this.content.mention.fontSize,
                '--mention-fontFamily': this.content.mention.fontFamily,
                '--mention-fontWeight': this.content.mention.fontWeight,
                '--mention-color': this.content.mention.color,
                '--mention-borderSize': this.content.mention.borderSize,
                '--mention-border-radius': this.content.mention.borderRadius,
                // a
                '--a-fontSize': this.content.a.fontSize,
                '--a-fontFamily': this.content.a.fontFamily,
                '--a-fontWeight': this.content.a.fontWeight,
                '--a-textAlign': this.content.a.textAlign,
                '--a-color': this.content.a.color,
                '--a-lineHeight': this.content.a.lineHeight,
                '--a-underline': this.content.a.isUnderline ? 'underline' : 'none',
                // blockquote
                '--blockquote-color': this.content.blockquote.color,
                '--blockquote-border-color': this.content.blockquote.borderColor,
                '--blockquote-margin-top': this.content.blockquote.marginTop,
                '--blockquote-margin-bottom': this.content.blockquote.marginBottom,
                // code
                '--code-color': this.content.code.color,
                '--code-bg-color': this.content.code.bgColor,
                '--code-border-radius': this.content.code.borderRadius,
                '--code-padding-y': this.content.code.paddingY,
                '--code-padding-x': this.content.code.paddingX,
                '--code-font-size': this.content.code.fontSize,
                // img
                '--img-max-width': this.content.img?.maxWidth,
                '--img-max-height': this.content.img?.maxHeight,
            };
        },
        delay() {
            return wwLib.wwUtils.getLengthUnit(this.content.debounceDelay)[0];
        },
    },
    methods: {
        loadEditor() {
            if (this.loading) return;
            this.loading = true;
            if (this.richEditor) this.richEditor.destroy();
            this.richEditor = new Editor({
                content: String(this.content.initialValue || ''),
                editable: this.isEditable,
                autofocus: this.editorConfig.autofocus,
                extensions: [
                    StarterKit,
                    Link,
                    TextStyle,
                    Color,
                    Underline,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),
                    Placeholder.configure({
                        placeholder: this.editorConfig.placeholder,
                    }),
                    Markdown,
                    Image.configure({ ...this.editorConfig.image }),
                    this.editorConfig.mention.enabled &&
                        Mention.configure({
                            HTMLAttributes: {
                                class: 'mention',
                            },
                            suggestion: {
                                items: ({ query }) =>
                                    this.editorConfig.mention.list
                                        .filter(({ label }) => label.toLowerCase().startsWith(query.toLowerCase()))
                                        .slice(0, this.mentionListLength),
                                render: suggestion.render,
                                allowSpaces: this.editorConfig.mention.allowSpaces,
                                char: this.editorConfig.mention.char,
                            },
                        }),
                ],
                onCreate: () => {
                    this.setValue(this.getContent());
                    this.setMentions(this.richEditor.getJSON().content.reduce(extractMentions, []));
                },
                onUpdate: () => {
                    const htmlValue = this.getContent();
                    if (this.variableValue === htmlValue) return;
                    this.setValue(htmlValue);
                    if (this.content.debounce) {
                        this.isDebouncing = true;
                        if (this.debounce) {
                            clearTimeout(this.debounce);
                        }
                        this.debounce = setTimeout(() => {
                            this.$emit('trigger-event', { name: 'change', event: { value: this.variableValue } });
                            this.isDebouncing = false;
                        }, this.delay);
                    } else {
                        this.$emit('trigger-event', { name: 'change', event: { value: this.variableValue } });
                    }
                    this.setMentions(this.richEditor.getJSON().content.reduce(extractMentions, []));
                },
                editorProps: {
                    handleClickOn: (view, pos, node) => {
                        if (node.type.name === 'mention') {
                            this.$emit('trigger-event', {
                                name: 'mention:click',
                                event: { mention: { id: node.attrs.id, label: node.attrs.label } },
                            });
                        }
                    },
                },
            });
            this.loading = false;
        },
        setLink(url) {
            if (this.richEditor.isActive('link')) {
                this.richEditor.chain().focus().unsetLink().run();
                return;
            }

            const previousUrl = this.richEditor.getAttributes('link').href;
            const selectedUrl = url ?? window.prompt('URL', previousUrl);

            // cancelled
            if (selectedUrl === null) {
                return;
            }

            // empty
            if (selectedUrl === '') {
                this.richEditor.chain().focus().extendMarkRange('link').unsetLink().run();

                return;
            }

            // update link
            this.richEditor.chain().focus().extendMarkRange('link').setLink({ href: selectedUrl }).run();
        },
        setImage(src, alt = '', title = '') {
            this.richEditor.commands.setImage({ src, alt, title });
        },
        focusEditor() {
            this.richEditor.chain().focus().run();
        },
        setTag(tag) {
            if (typeof tag === 'string') {
                tag = tag.toLocaleLowerCase().trim();
                if (tag in TAGS_MAP) tag = TAGS_MAP[tag];
            }
            if (tag === 0) this.richEditor.chain().focus().setParagraph().run();
            if (tag !== 0)
                this.richEditor
                    .chain()
                    .focus()
                    .toggleHeading({ level: Number(tag) })
                    .run();
        },
        toggleUnderline() {
            this.richEditor.chain().focus().toggleMark('underline').run();
        },
        toggleBold() {
            this.richEditor.chain().focus().toggleBold().run();
        },
        toggleItalic() {
            this.richEditor.chain().focus().toggleItalic().run();
        },
        toggleUnderline() {
            this.richEditor.chain().focus().toggleUnderline().run();
        },
        toggleStrike() {
            this.richEditor.chain().focus().toggleStrike().run();
        },
        setTextAlign(textAlign) {
            this.richEditor.chain().focus().setTextAlign(textAlign).run();
        },
        setColor(color) {
            this.richEditor.chain().focus().setColor(color).run();
        },
        toggleBulletList() {
            this.richEditor.chain().focus().toggleBulletList().run();
        },
        toggleOrderedList() {
            this.richEditor.chain().focus().toggleOrderedList().run();
        },
        toggleCodeBlock() {
            this.richEditor.chain().focus().toggleCodeBlock().run();
        },
        toggleBlockquote() {
            this.richEditor.chain().focus().toggleBlockquote().run();
        },
        undo() {
            this.richEditor.chain().undo().run();
        },
        redo() {
            this.richEditor.chain().redo().run();
        },
        getContent() {
            if(this.content.output === 'markdown') return this.richEditor.storage.markdown.getMarkdown()
            return this.richEditor.getHTML()
        }
    },
    mounted() {
        this.loadEditor();
    },
    beforeUnmount() {
        if (this.richEditor) this.richEditor.destroy();
    },
};
</script>

<style lang="scss">
.ww-rich-text {
    --menu-color: unset;
    display: flex;
    flex-direction: column;
    height: inherit !important;

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
        min-height: 32px;
        select {
            padding: 8px;
            appearance: none;
            border: none;
            font-weight: 700;
            cursor: pointer;
            color: var(--menu-color);
            background-color: transparent;
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

    .ProseMirror {
        /* Basic editor styles */
        cursor: text;
        max-height: 100%;
        overflow: auto;
        padding: 8px;
        &-focused {
            outline: unset;
        }
        > * + * {
            margin-top: 0.75em;
        }

        /* Placeholder (at the top) */
        & p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
        }

        h1 {
            font-size: var(--h1-fontSize);
            font-family: var(--h1-fontFamily);
            font-weight: var(--h1-fontWeight);
            text-align: var(--h1-textAlign);
            color: var(--h1-color);
            line-height: var(--h1-lineHeight);
            margin-top: var(--h1-margin-top);
            margin-bottom: var(--h1-margin-bottom);
        }
        h2 {
            font-size: var(--h2-fontSize);
            font-family: var(--h2-fontFamily);
            font-weight: var(--h2-fontWeight);
            text-align: var(--h2-textAlign);
            color: var(--h2-color);
            line-height: var(--h2-lineHeight);
            margin-top: var(--h2-margin-top);
            margin-bottom: var(--h2-margin-bottom);
        }
        h3 {
            font-size: var(--h3-fontSize);
            font-family: var(--h3-fontFamily);
            font-weight: var(--h3-fontWeight);
            text-align: var(--h3-textAlign);
            color: var(--h3-color);
            line-height: var(--h3-lineHeight);
            margin-top: var(--h3-margin-top);
            margin-bottom: var(--h3-margin-bottom);
        }
        h4 {
            font-size: var(--h4-fontSize);
            font-family: var(--h4-fontFamily);
            font-weight: var(--h4-fontWeight);
            text-align: var(--h4-textAlign);
            color: var(--h4-color);
            line-height: var(--h4-lineHeight);
            margin-top: var(--h4-margin-top);
            margin-bottom: var(--h4-margin-bottom);
        }
        h5 {
            font-size: var(--h5-fontSize);
            font-family: var(--h5-fontFamily);
            font-weight: var(--h5-fontWeight);
            text-align: var(--h5-textAlign);
            color: var(--h5-color);
            line-height: var(--h5-lineHeight);
            margin-top: var(--h5-margin-top);
            margin-bottom: var(--h5-margin-bottom);
        }
        h6 {
            font-size: var(--h6-fontSize);
            font-family: var(--h6-fontFamily);
            font-weight: var(--h6-fontWeight);
            text-align: var(--h6-textAlign);
            color: var(--h6-color);
            line-height: var(--h6-lineHeight);
            margin-top: var(--h6-margin-top);
            margin-bottom: var(--h6-margin-bottom);
        }
        p {
            font-size: var(--p-fontSize);
            font-family: var(--p-fontFamily);
            font-weight: var(--p-fontWeight);
            text-align: var(--p-textAlign);
            color: var(--p-color);
            line-height: var(--p-lineHeight);
            margin-top: var(--p-margin-top);
            margin-bottom: var(--p-margin-bottom);
        }
        a {
            display: initial;
            text-decoration: var(--a-underline);
            font-size: var(--a-fontSize);
            font-family: var(--a-fontFamily);
            font-weight: var(--a-fontWeight);
            text-align: var(--a-textAlign);
            color: var(--a-color);
            line-height: var(--a-lineHeight);
            cursor: pointer;
        }
        font-size: var(--p-fontSize);
        font-family: var(--p-fontFamily);
        font-weight: var(--p-fontSize);
        text-align: var(--p-textAlign);
        color: var(--p-color);
        line-height: var(--p-lineHeight);

        .mention {
            border: var(--mention-borderSize) solid var(--mention-color);
            border-radius: var(--mention-border-radius);
            padding: 0.1rem 0.3rem;
            box-decoration-break: clone;
            cursor: pointer;
            font-size: var(--mention-fontSize);
            font-family: var(--mention-fontFamily);
            font-weight: var(--mention-fontSize);
            color: var(--mention-color);
        }

        table {
            margin: 64px 0 !important;
            width: 100% !important;
            display: table;
            border-collapse: collapse;
            box-sizing: border-box;
            text-indent: initial;
            border-spacing: 2px;

            thead > tr {
                background: #f7f7fa;

                th {
                    color: #5a6482;
                    font-family: Work Sans;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 15px;
                    line-height: 18px;
                    letter-spacing: -0.08px;
                }
            }
            td,
            th {
                text-align: left;
                padding: 1.25em 1rem !important;
            }
            tbody {
                border: 1px solid #d1cfd7;
                tr:nth-child(2n) {
                    background: #f7f7fa;
                }
            }
        }
        blockquote {
            color: var(--blockquote-color);
            border-left: 0.2rem solid var(--blockquote-border-color);
            margin: 1rem 0;
            padding: 0.25rem 0 0.25rem 1rem;
            margin-top: var(--blockquote-margin-top);
            margin-bottom: var(--blockquote-margin-bottom);
        }

        pre {
            background: var(--code-bg-color);
            color: var(--code-color);
            font-family: 'JetBrainsMono', monospace;
            padding: var(--code-padding-y) var(--code-padding-x);
            border-radius: var(--code-border-radius);

            code {
                color: inherit;
                padding: 0;
                background: none;
                font-size: var(--code-font-size);
            }
        }

        img {
            max-width: var(--img-max-width);
            max-height: var(--img-max-height);
        }
    }

    &.-readonly .ProseMirror {
        cursor: inherit;
    }
}
</style>
