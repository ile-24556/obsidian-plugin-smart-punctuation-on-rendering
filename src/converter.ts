import DOMPurify from "dompurify";

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
  const originalCodeTexts: string[] = [];
  for (const c of element.querySelectorAll("code")) {
    // Somehow Jest fails if I use `.innerText` instead of `.innerHTML`.
    // On Obsidian, both properties work fine.
    originalCodeTexts.push(c.innerHTML);
  }
  element.replaceChildren(stringToCleanDOMFragment(convert(element.innerHTML)));

  let i = 0;
  for (const c of element.querySelectorAll("code")) {
    const it = originalCodeTexts[i]!;
    if (it == null) {
      console.error(`originalCodeTexts[${i}] is not available`);
      continue;
    }
    // Same as `originalCodeTexts.push(c.innerHTML)` above.
    c.replaceChildren(stringToCleanDOMFragment(it));
    i++;
  }
}

function stringToCleanDOMFragment(input: string): DocumentFragment {
  // I was not able to use `obsidian.sanitizeHTMLToDom()` with Jest, so pick `DOMPurify`.
  return DOMPurify.sanitize(input, { RETURN_DOM_FRAGMENT: true });
}
