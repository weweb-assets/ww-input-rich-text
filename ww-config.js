function showObjectPropertyPath(basePropertyKey, {content, boundProps}) {
  return boundProps[basePropertyKey] && content[basePropertyKey] && typeof wwLib.wwCollection.getCollectionData(content[basePropertyKey])[0] === 'object'
}
function getObjectPropertyPathOptions(basePropertyKey, {content}) {
  const data = wwLib.wwCollection.getCollectionData(content[basePropertyKey])
  if (!data.length || typeof data[0] !== 'object') {
      return null;
  }

  return { object: data[0] };
}

export default {
  editor: {
    label: {
      en: 'Rich text',
    },
    customSettingsPropertiesOrder: [
      'initialValue', 'placeholder', 'autofocus', 'editable', 'showMenu',
      'enableMention', ['mentionChar', 'mentionAllowSpaces', 'mentionList', 'mentionIdPath', 'mentionLabelPath']
    ]
  },
  triggerEvents: [
    { name: 'change', label: { en: 'On change' }, event: { value: '' } },
    { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    { name: 'mention:click', label: { en: 'On mention click' }, event: { mention: { id: '', label: '' } } },
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
          type: 'Object',
          defaultValue: {id: '', label: ''},
          options: {
            item: {
                id: {
                  label: { en: 'Id' },
                  type: 'Text'
                },
                label: {
                    label: { en: 'Label' },
                    type: 'Text',
                },
            },
          },
        },
      },
      defaultValue: [],
      bindable: true
    },
    mentionIdPath: {
      hidden: (content, sidepanelContent, boundProps) => !showObjectPropertyPath('mentionList', {content, boundProps}),
      label: {
          en: 'Id property',
      },
      type: 'ObjectPropertyPath',
      options: content => getObjectPropertyPathOptions('mentionList', {content}),
      defaultValue: null,
      section: 'settings',
    },
    mentionLabelPath: {
      hidden: (content, sidepanelContent, boundProps) => !showObjectPropertyPath('mentionList', {content, boundProps}),
      label: {
          en: 'Label property',
      },
      type: 'ObjectPropertyPath',
      options: content => getObjectPropertyPathOptions('mentionList', {content}),
      defaultValue: null,
      section: 'settings',
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
