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
      {
        description: "curly apostrophe",
        input: "That's it",
        output: "That’s it",
      },
    ];

    for (const c of cases) {
      test(c.description, () => {
        expect(convert(c.input)).toBe(c.output);
      });
    }
  });
});
