import { describe, expect, it } from "vitest";
import { fenceCodeBlock } from "./fence.js";

describe("fenceCodeBlock", () => {
  it("wraps plain content in a standard triple-backtick fence", () => {
    expect(fenceCodeBlock("text", "pod/foo   1/1   Running")).toBe(
      "```text\npod/foo   1/1   Running\n```",
    );
  });

  it("widens the fence past a triple-backtick run embedded in the content", () => {
    const logs = "app crashed while rendering:\n```\nfenced block from the app itself\n```";
    const wrapped = fenceCodeBlock("text", logs);
    expect(wrapped.startsWith("````text\n")).toBe(true);
    expect(wrapped.endsWith("\n````")).toBe(true);
    // The embedded fence must survive untouched inside the wider outer fence.
    expect(wrapped).toContain(logs);
  });

  it("widens the fence past the longest of several backtick runs", () => {
    const logs = "a `single` backtick, then ```three```, then ````four````.";
    const wrapped = fenceCodeBlock("text", logs);
    expect(wrapped.startsWith("`````text\n")).toBe(true);
    expect(wrapped.endsWith("\n`````")).toBe(true);
  });
});
