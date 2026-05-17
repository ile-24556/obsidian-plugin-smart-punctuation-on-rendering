import { sanitizeHTMLToDom } from "obsidian";

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
    pattern: /(^|[^(])--/g,
    replacement: "$1–",
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
  for (const e of ALL_PUNCTUATIONS) {
    text = text.replaceAll(e.pattern, e.replacement);
    if (e.potentialOverlappedMatches) {
      // Consider 'xoxox'.replaceAll('xox', 'xyx')
      text = text.replaceAll(e.pattern, e.replacement);
    }
  }
  return text;
}

export function modifyElement(element: HTMLElement) {
  // Callout icons are week to modifications including `replaceChildren()`;
  // If this element contains a callout, modify it without touching the icon.
  if (element.querySelector("div.callout-icon") != null) {
    for (const e of element.querySelectorAll("div.callout-title-inner, div.callout-content")) {
      modifyElement(e as HTMLElement);
    }
    return;
  }

  const originalCodeElements = element.querySelectorAll("code");

  element.replaceChildren(sanitizeHTMLToDom(convert(element.innerHTML)));

  // Restore preserved inline code elements.
  element.querySelectorAll("code").forEach((e, i) => {
    const oe = originalCodeElements[i];
    if (oe == null) {
      console.error(`originalCodeElements[${i}] is not available`);
      return;
    }
    e.replaceChildren(sanitizeHTMLToDom(oe.innerHTML));
  });
}
