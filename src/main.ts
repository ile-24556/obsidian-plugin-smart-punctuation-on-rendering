import { Plugin } from "obsidian";

const ALL_PUNCTUATIONS: Record<string, string> = {
  "---": "\u2014",
  "--": "\u2013",
};

export default class ExamplePlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor((element, _context) => {
      const paragraphs = element.findAll("p");

      for (const paragraph of paragraphs) {
        let text = paragraph.innerText;
        for (const key in ALL_PUNCTUATIONS) {
          const v = ALL_PUNCTUATIONS[key]!;
          text = text.replaceAll(key, v);
        }
        paragraph.replaceWith(text);
      }
    });
  }
}
