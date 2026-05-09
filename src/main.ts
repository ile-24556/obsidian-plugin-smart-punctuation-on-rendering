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
    replacement: "$1–$2",
  },
  {
    char: "em dash",
    pattern: /(^|[^-])---([^-]|$)/g,
    replacement: "$1—$2",
  },
  {
    char: "single quotation marks",
    pattern: /(^|\s|>)'([^']*)'($|\s|<)/g,
    replacement: "$1‘$2’$3",
  },
  {
    char: "right single quotation mark",
    pattern: /([^ >=])'/g,
    replacement: "$1’",
  },
  {
    char: "double quotation marks",
    pattern: /(^|\s|>)"([^"]*)"($|\s|<)/g,
    replacement: "$1“$2”$3",
  },
  {
    char: "horizontal ellipsis",
    pattern: /\.\.\./g,
    replacement: "…",
  },
];

export default class ExamplePlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor((element) => {
      let text = element.innerHTML;
      if (text.includes("</code>")) {
        return;
      }
      for (const e of ALL_PUNCTUATIONS) {
        text = text.replaceAll(e.pattern, e.replacement);
      }
      element.innerHTML = text;
    });
  }
}
