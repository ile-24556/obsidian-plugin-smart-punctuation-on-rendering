import { Plugin } from "obsidian";

interface Pattern {
  char: string;
  pattern: RegExp;
  replacement: string;
}

const ALL_PUNCTUATIONS: Pattern[] = [
  {
    char: "en dash",
    pattern: /(^|[^-])--([^-]|$)/g,
    replacement: "$1\u2013$2",
  },
  {
    char: "em dash",
    pattern: /(^|[^-])---([^-]|$)/g,
    replacement: "$1\u2014$2",
  },
  {
    char: "left single quotation mark",
    pattern: /(^|[ ])'([^ ])/g,
    replacement: "$1\u2018$2",
  },
  {
    char: "right single quotation mark",
    pattern: /([^ ])'/g,
    replacement: "$1\u2019",
  },
  {
    char: "left double quotation mark",
    pattern: /(^|[ ])"([^ ])/g,
    replacement: "$1\u201C$2",
  },
  {
    char: "right double quotation mark",
    pattern: /([^ ])"/g,
    replacement: "$1\u201D",
  },
  {
    char: "horizontal ellipsis",
    pattern: /(^|[^.])\.\.\.($|[^.])/g,
    replacement: "$1\u2026$2",
  },
];

export default class ExamplePlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor((element) => {
      for (const child of element.children) {
        let text = child.innerHTML;
        for (const e of ALL_PUNCTUATIONS) {
          text = text.replaceAll(e.pattern, e.replacement);
        }
        child.innerHTML = text;
      }
    });
  }
}
