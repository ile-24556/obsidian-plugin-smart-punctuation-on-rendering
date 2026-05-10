import { describe, expect, test } from "@jest/globals";
import { convert } from "../src/converter";

describe("converter", () => {
  describe("convert()", () => {
    interface Case {
      description: string;
      input: string;
      output: string;
    }

    const cases: Case[] = [
      // ---------------------------------------------------------
      // The following test cases are taken from
      // https://github.com/commonmark/commonmark.js and modified.
      // ---------------------------------------------------------
      {
        description:
          "Open quotes are matched with closed quotes. The same method is used for matching openers and closers as is used in emphasis parsing:",
        input: "<p>\"Hello,\" said the spider.\n\"'Shelob' is my name.\"</p>",
        output: "<p>“Hello,” said the spider.\n“‘Shelob’ is my name.”</p>",
      },
      {
        description: "",
        input: "<p>'A', 'B', and 'C' are letters.</p>",
        output: "<p>‘A’, ‘B’, and ‘C’ are letters.</p>",
      },
      {
        description: "",
        input: "<p>'Oak,' 'elm,' and 'beech' are names of trees.\nSo is 'pine.'</p>",
        output: "<p>‘Oak,’ ‘elm,’ and ‘beech’ are names of trees.\nSo is ‘pine.’</p>",
      },
      { description: "", input: "<p>'He said, \"I want to go.\"'</p>", output: "<p>‘He said, “I want to go.”’</p>" },
      {
        description:
          "A single quote that isn't an open quote matched with a close quote will be treated as an apostrophe:",
        input: "<p>Were you alive in the 70's?</p>",
        output: "<p>Were you alive in the 70’s?</p>",
      },
      // {
      //   description: "",
      //   input: "<p>Here is some quoted '<code>code</code>' and a \"<a href=\"url\">quoted link</a>\".</p>",
      //   output: "<p>Here is some quoted ‘<code>code</code>’ and a “<a href=\"url\">quoted link</a>”.</p>",
      // },
      {
        description:
          "Here the first `'` is treated as an apostrophe, not an open quote, because the final single quote is matched by the single quote before `jolly`:",
        input: "<p>'tis the season to be 'jolly'</p>",
        output: "<p>’tis the season to be ‘jolly’</p>",
      },
      // {
      //   description: "Multiple apostrophes should not be marked as open/closing quotes.",
      //   input: "<p>'We'll use Jane's boat and John's truck,' Jenna said.</p>",
      //   output: "<p>‘We’ll use Jane’s boat and John’s truck,’ Jenna said.</p>",
      // },
      // {
      //   description: "An unmatched double quote will be interpreted as a left double quote, to facilitate this style:",
      //   input: "<p>\"A paragraph with no closing quote.</p>\n<p>\"Second paragraph by same speaker, in fiction.\"</p>",
      //   output: "<p>“A paragraph with no closing quote.</p>\n<p>“Second paragraph by same speaker, in fiction.”</p>",
      // },
      // {
      //   description: "Quotes that are escaped come out as literal straight quotes:",
      //   input: "<p>\\\"This is not smart.\\\"\nThis isn\\'t either.\n5\\'8\\\"</p>",
      //   output: "<p>&quot;This is not smart.&quot;\nThis isn't either.\n5'8&quot;</p>",
      // },
      {
        description: "Two hyphens form an en-dash, three an em-dash.",
        input: "<p>Some dashes:  em---em\nen--en\nem --- em\nen -- en\n2--3</p>",
        output: "<p>Some dashes:  em—em\nen–en\nem — em\nen – en\n2–3</p>",
      },
      {
        description:
          "A sequence of more than three hyphens is parsed as a sequence of em and/or en dashes, with no hyphens. If possible, a homogeneous sequence of dashes is used (so, 10 hyphens = 5 en dashes, and 9 hyphens = 3 em dashes). When a heterogeneous sequence must be used, the em dashes come first, followed by the en dashes, and as few en dashes as possible are used (so, 7 hyphens = 2 em dashes an 1 en dash).",
        input: "<p>one-\ntwo--\nthree---\nfour----\nsix------</p>",
        output: "<p>one-\ntwo–\nthree—\nfour––\nsix——</p>",
      },
      // {
      //   description: "Hyphens can be escaped:",
      //   input: "<p>Escaped hyphens: \\-- \\-\\-\\-.</p>",
      //   output: "<p>Escaped hyphens: -- ---.</p>",
      // },
      {
        description: "Three periods form an ellipsis:",
        input: "<p>Ellipses...and...and....</p>",
        output: "<p>Ellipses…and…and….</p>",
      },
      // {
      //   description: "Periods can be escaped if ellipsis-formation is not wanted:",
      //   input: "<p>No ellipses\\.\\.\\.</p>",
      //   output: "<p>No ellipses...</p>",
      // },
    ];

    for (const c of cases) {
      test(c.description, () => {
        expect(convert(c.input)).toBe(c.output);
      });
    }
  });
});
