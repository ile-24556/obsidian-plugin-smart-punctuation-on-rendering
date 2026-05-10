interface Pattern {
  char: string;
  pattern: string | RegExp;
  replacement: string;
}

const ALL_PUNCTUATIONS: Pattern[] = [
  {
    char: "two em dashes",
    pattern: "------",
    replacement: "——",
  },
  {
    char: "two en dashes",
    pattern: "----",
    replacement: "––",
  },
  {
    char: "em dash",
    pattern: "---",
    replacement: "—",
  },
  {
    char: "en dash",
    pattern: "--",
    replacement: "–",
  },
  {
    char: "single quotation marks",
    pattern: /(^|\s|>|[,-.–—])'([^']*)'($|\s|<|[,-.–—])/g,
    replacement: "$1‘$2’$3",
  },
  {
    char: "right single quotation mark",
    pattern: /([^ >=])'/g,
    replacement: "$1’",
  },
  {
    char: "double quotation marks",
    pattern: /(^|\s|>|[,-.–—])"([^"]*)"($|\s|<|[,-.–—])/g,
    replacement: "$1“$2”$3",
  },
  {
    char: "horizontal ellipsis",
    pattern: /\.\.\./g,
    replacement: "…",
  },
];

export function convert(text: string): string {
  if (text.includes("</code>")) {
    return text;
  }
  for (const e of ALL_PUNCTUATIONS) {
    text = text.replaceAll(e.pattern, e.replacement);
  }
  return text;
}
