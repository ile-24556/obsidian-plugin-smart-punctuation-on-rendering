interface Pattern {
  char: string;
  pattern: string | RegExp;
  replacement: string;
  potentialOverlappedMatches: boolean;
}

const ALL_PUNCTUATIONS: Pattern[] = [
  {
    char: "two em dashes",
    pattern: "------",
    replacement: "——",
    potentialOverlappedMatches: false,
  },
  {
    char: "two en dashes",
    pattern: "----",
    replacement: "––",
    potentialOverlappedMatches: false,
  },
  {
    char: "em dash",
    pattern: "---",
    replacement: "—",
    potentialOverlappedMatches: false,
  },
  {
    char: "en dash",
    pattern: "--",
    replacement: "–",
    potentialOverlappedMatches: false,
  },
  {
    char: "single quotation marks",
    pattern: /(^|\s|>|[!-/:;?[-`{-~–-”])'([^']*?)'($|\s|<|[!-/:;?[-`{-~–-”])/g,
    replacement: "$1‘$2’$3",
    potentialOverlappedMatches: true,
  },
  {
    char: "right single quotation mark",
    pattern: /([^ =])'/g,
    replacement: "$1’",
    potentialOverlappedMatches: false,
  },
  {
    char: "double quotation marks",
    pattern: /(^|\s|>|[!-/:;?[-`{-~–-”])"([^"]*?)"($|\s|<|[!-/:;?[-`{-~–-”])/g,
    replacement: "$1“$2”$3",
    potentialOverlappedMatches: true,
  },
  {
    char: "horizontal ellipsis",
    pattern: /\.\.\./g,
    replacement: "…",
    potentialOverlappedMatches: false,
  },
];

export function convert(text: string): string {
  if (text.includes("</code>")) {
    return text;
  }
  for (const e of ALL_PUNCTUATIONS) {
    text = text.replaceAll(e.pattern, e.replacement);
    if (e.potentialOverlappedMatches) {
      // Consider 'xoxox'.replaceAll('xox', 'xyx')
      text = text.replaceAll(e.pattern, e.replacement);
    }
  }
  return text;
}
