import { Plugin } from "obsidian";
import { convert } from "./converter";

export default class ExamplePlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor((element) => {
      // eslint-disable-next-line no-unsanitized/property, @microsoft/sdl/no-inner-html
      element.innerHTML = convert(element.innerHTML);
    });
  }
}
