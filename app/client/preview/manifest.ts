// Liste des pages de composants (sidebar de l'atelier). Générée depuis les démos ;
// tests/catalogue.test.ts vérifie qu'elle reste identique à preview/demos.
export interface ManifestFamily {
  id: string;
  title: string;
  items: { id: string; title: string }[];
}
export const manifest: ManifestFamily[] = [
  {
    id: 'actions',
    title: 'Actions et éléments de base',
    items: [
      {
        id: 'button',
        title: 'Button',
      },
      {
        id: 'button-group',
        title: 'Button Group',
      },
      {
        id: 'toggle',
        title: 'Toggle',
      },
      {
        id: 'toggle-group',
        title: 'Toggle Group',
      },
      {
        id: 'badge',
        title: 'Badge',
      },
      {
        id: 'kbd',
        title: 'Kbd',
      },
      {
        id: 'separator',
        title: 'Separator',
      },
      {
        id: 'avatar',
        title: 'Avatar',
      },
      {
        id: 'simple-icon',
        title: 'Simple Icon',
      },
      {
        id: 'file-icon',
        title: 'File Icon',
      },
      {
        id: 'spinner',
        title: 'Spinner',
      },
      {
        id: 'skeleton',
        title: 'Skeleton',
      },
      {
        id: 'aspect-ratio',
        title: 'Aspect Ratio',
      },
      {
        id: 'direction',
        title: 'Direction',
      },
    ],
  },
  {
    id: 'forms',
    title: 'Formulaires',
    items: [
      {
        id: 'input',
        title: 'Input',
      },
      {
        id: 'input-group',
        title: 'Input Group',
      },
      {
        id: 'input-otp',
        title: 'Input OTP',
      },
      {
        id: 'textarea',
        title: 'Textarea',
      },
      {
        id: 'label',
        title: 'Label',
      },
      {
        id: 'field',
        title: 'Field',
      },
      {
        id: 'checkbox',
        title: 'Checkbox',
      },
      {
        id: 'radio-group',
        title: 'Radio Group',
      },
      {
        id: 'switch',
        title: 'Switch',
      },
      {
        id: 'slider',
        title: 'Slider',
      },
      {
        id: 'select',
        title: 'Select',
      },
      {
        id: 'native-select',
        title: 'Native Select',
      },
      {
        id: 'combobox',
        title: 'Combobox',
      },
      {
        id: 'calendar',
        title: 'Calendar',
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation et structure',
    items: [
      {
        id: 'breadcrumb',
        title: 'Breadcrumb',
      },
      {
        id: 'pagination',
        title: 'Pagination',
      },
      {
        id: 'tabs',
        title: 'Tabs',
      },
      {
        id: 'navigation-menu',
        title: 'Navigation Menu',
      },
      {
        id: 'menubar',
        title: 'Menubar',
      },
      {
        id: 'sidebar',
        title: 'Sidebar',
      },
      {
        id: 'accordion',
        title: 'Accordion',
      },
      {
        id: 'collapsible',
        title: 'Collapsible',
      },
      {
        id: 'scroll-area',
        title: 'Scroll Area',
      },
      {
        id: 'resizable',
        title: 'Resizable',
      },
      {
        id: 'carousel',
        title: 'Carousel',
      },
    ],
  },
  {
    id: 'display',
    title: 'Affichage de données',
    items: [
      {
        id: 'card',
        title: 'Card',
      },
      {
        id: 'item',
        title: 'Item',
      },
      {
        id: 'table',
        title: 'Table',
      },
      {
        id: 'empty',
        title: 'Empty',
      },
      {
        id: 'alert',
        title: 'Alert',
      },
      {
        id: 'progress',
        title: 'Progress',
      },
      {
        id: 'usage-bar',
        title: 'Usage Bar',
      },
      {
        id: 'chart',
        title: 'Chart',
      },
      {
        id: 'marker',
        title: 'Marker',
      },
      {
        id: 'sonner',
        title: 'Sonner (toast)',
      },
    ],
  },
  {
    id: 'overlays',
    title: 'Superpositions et menus',
    items: [
      {
        id: 'dialog',
        title: 'Dialog',
      },
      {
        id: 'alert-dialog',
        title: 'Alert Dialog',
      },
      {
        id: 'sheet',
        title: 'Sheet',
      },
      {
        id: 'drawer',
        title: 'Drawer',
      },
      {
        id: 'popover',
        title: 'Popover',
      },
      {
        id: 'hover-card',
        title: 'Hover Card',
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
      },
      {
        id: 'dropdown-menu',
        title: 'Dropdown Menu',
      },
      {
        id: 'context-menu',
        title: 'Context Menu',
      },
      {
        id: 'command',
        title: 'Command',
      },
    ],
  },
  {
    id: 'ai',
    title: 'Interfaces conversationnelles',
    items: [
      {
        id: 'ai-chat-composer',
        title: 'AI Chat Composer',
      },
      {
        id: 'attachment',
        title: 'Attachment',
      },
      {
        id: 'bubble',
        title: 'Bubble',
      },
      {
        id: 'message',
        title: 'Message',
      },
      {
        id: 'message-scroller',
        title: 'Message Scroller',
      },
      {
        id: 'trace',
        title: 'AI Trace',
      },
      {
        id: 'diff',
        title: 'Diff',
      },
    ],
  },
  {
    id: 'blocks',
    title: 'Blocs',
    items: [
      {
        id: 'chat-sidebar-01',
        title: 'Chat Sidebar',
      },
      {
        id: 'chat-thread-01',
        title: 'Chat Thread',
      },
      {
        id: 'chat-welcome-01',
        title: 'Chat Welcome',
      },
      {
        id: 'prompt-input-01',
        title: 'Prompt Input',
      },
      {
        id: 'model-picker-01',
        title: 'Model Picker',
      },
      {
        id: 'effort-slider-01',
        title: 'Effort Slider',
      },
      {
        id: 'sleep-widget-01',
        title: 'Sleep Widget',
      },
    ],
  },
];
