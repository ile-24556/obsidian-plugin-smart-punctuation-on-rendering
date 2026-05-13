import { Plugin } from "obsidian";
import { modifyElement } from "./converter";

export default class ExamplePlugin extends Plugin {
  override async onload() {
    this.registerMarkdownPostProcessor(modifyElement);
  }
}
