// polyfills.js
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Polyfill for document (needed by stellar-wallets-kit)
if (typeof global.document === 'undefined') {
  global.document = {
    createElement: (tagName) => ({
      tagName: tagName.toUpperCase(),
      getAttribute: () => null,
      setAttribute: () => {},
      removeAttribute: () => {},
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      style: {},
      innerHTML: '',
      textContent: '',
      parentNode: null,
      firstChild: null,
      lastChild: null,
      childNodes: [],
      nodeType: 1,
      nodeName: tagName.toUpperCase(),
    }),
    createTextNode: (text) => ({
      nodeType: 3,
      nodeName: '#text',
      textContent: text,
      parentNode: null,
    }),
    createDocumentFragment: () => ({
      nodeType: 11,
      nodeName: '#document-fragment',
      appendChild: () => {},
      removeChild: () => {},
      childNodes: [],
    }),
    createTreeWalker: (root, whatToShow, filter) => ({
      root: root,
      whatToShow: whatToShow || 0xFFFFFFFF,
      filter: filter,
      currentNode: root,
      nextNode: () => null,
      previousNode: () => null,
      firstChild: () => null,
      lastChild: () => null,
      parentNode: () => null,
      nextSibling: () => null,
      previousSibling: () => null,
    }),
    getElementById: () => null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    body: {
      appendChild: () => {},
      removeChild: () => {},
      innerHTML: '',
      style: {},
    },
    head: {
      appendChild: () => {},
      removeChild: () => {},
    },
    documentElement: {
      style: {},
    },
  };
}

// Polyfill for window
if (typeof global.window === 'undefined') {
  global.window = global;
}

// Polyfill for navigator
if (typeof global.navigator === 'undefined') {
  global.navigator = {
    userAgent: 'react-native',
    platform: 'react-native',
  };
}

// Polyfill for location
if (typeof global.location === 'undefined') {
  global.location = {
    href: 'about:blank',
    protocol: 'about:',
    host: '',
    hostname: '',
    port: '',
    pathname: '/blank',
    search: '',
    hash: '',
    origin: 'about:blank',
  };
}

// Additional polyfills for DOM APIs
if (typeof global.Node === 'undefined') {
  global.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,
  };
}

// Polyfill for NodeFilter
if (typeof global.NodeFilter === 'undefined') {
  global.NodeFilter = {
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2,
    FILTER_SKIP: 3,
    SHOW_ALL: 0xFFFFFFFF,
    SHOW_ELEMENT: 0x1,
    SHOW_ATTRIBUTE: 0x2,
    SHOW_TEXT: 0x4,
    SHOW_CDATA_SECTION: 0x8,
    SHOW_ENTITY_REFERENCE: 0x10,
    SHOW_ENTITY: 0x20,
    SHOW_PROCESSING_INSTRUCTION: 0x40,
    SHOW_COMMENT: 0x80,
    SHOW_DOCUMENT: 0x100,
    SHOW_DOCUMENT_TYPE: 0x200,
    SHOW_DOCUMENT_FRAGMENT: 0x400,
    SHOW_NOTATION: 0x800,
  };
}
