export default {
  editor: {
    label: {
      en: 'Rich text',
    },
    customSettingsPropertiesOrder: [
      'initialValue', 'placeholder', 'autofocus', 'editable', 'showMenu',
      'enableMention', ['mentionChar', 'mentionAllowSpaces', 'mentionList']
    ]
  },
  triggerEvents: [
    { name: 'change', label: { en: 'On change' }, event: { value: '' } },
    { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    { name: 'mention:click', label: { en: 'On mention click' }, event: { mention: '' } },
],
  properties: {
    showMenu: {
      label: {
        en: 'Show menu',
      },
      type: 'OnOff',
      defaultValue: true,
    },
    menuColor: {
      label: {
        en: 'Menu color',
      },
      type: 'Color',
      defaultValue: null
    },
    linkColor: {
      label: {
        en: 'Link color',
      },
      type: 'Color',
      defaultValue: null
    },
    mentionColor: {
      label: {
        en: 'Mention color',
      },
      type: 'Color',
      defaultValue: null
    },
    initialValue: {
      section: 'settings',
      label: {
        en: 'Init value',
      },
      type: 'Textarea',
      defaultValue: '',
      bindable: true,
    },
    placeholder: {
      section: 'settings',
      label: {
        en: 'Placeholder',
      },
      type: 'Textarea',
      defaultValue: 'Type here...',
      bindable: true,
    },
    enableMention: {
      section: 'settings',
      label: {
        en: 'Mentions',
      },
      type: 'OnOff',
      defaultValue: false,
    },
    mentionList: {
      section: 'settings',
      label: {
        en: 'Mentions List',
      },
      hidden: content => !content.enableMention,
      type: 'Array',
      options: {
        item: {
          type: 'Text',
          defaultValue: '',
        },
      },
      defaultValue: [],
      bindable: true
    },
    mentionAllowSpaces: {
      section: 'settings',
      hidden: content => !content.enableMention,
      label: {
        en: 'Allow spaces'
      },
      type: 'OnOff',
      defaultValue: false
    },
    mentionChar: {
      section: 'settings',
      hidden: content => !content.enableMention,
      label: {
        en: 'Char trigger'
      },
      type: 'Text',
      defaultValue: '@'
    },
    autofocus: {
      section: 'settings',
      label: {
        en: 'Autofocus',
      },
      type: 'OnOff',
      defaultValue: false,
    },
    editable: {
      section: 'settings',
      label: {
        en: 'Editable',
      },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
  },
};
