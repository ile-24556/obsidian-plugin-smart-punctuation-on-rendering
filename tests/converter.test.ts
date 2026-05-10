import { describe, expect, test } from "@jest/globals";
import { convert } from "../src/converter";

describe("converter", () => {
  describe("convert()", () => {
    test("curly apostrophe", () => {
      expect(convert("That's it")).toBe("That’s it");
    });
  });
});
