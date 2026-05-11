# Obsidian *Smart Punctuation on Rendering* plugin

Renders quotes as curly quotes, two dashes as an em dash, etc. in reading view.

| Source | Rendered |
| ------ | -------- |
| `--`   | –        |
| `---`  | —        |
| `...`  | …        |
| `""`   | “”       |
| `''`   | ‘’       |

## Limitations

- Live Preview is not supported.
- It may break elements.
  - The callout title icons will be disappeared.
- It may slow down the rendering of a huge note.
- It cannot recognize escaped ASCII punctuations e.g. `\-\-`, since it receives rendered HTML documents.
- It cannot handle complex text because it uses simple regexes and is not aware of AST.
