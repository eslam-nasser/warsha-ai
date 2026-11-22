import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const script = join(__dirname, "../../scripts/check-messages.mjs");
const run = (dir: string) => {
  try {
    execFileSync(process.execPath, [script, dir], { stdio: "pipe" });
    return 0;
  } catch (err) {
    return (err as { status: number }).status;
  }
};

describe("check-messages", () => {
  it("passes for the starter's own messages", () => {
    expect(run(join(__dirname, "../../messages"))).toBe(0);
  });

  it("fails when a key is missing in one locale", () => {
    const dir = mkdtempSync(join(tmpdir(), "messages-"));
    writeFileSync(join(dir, "en.json"), JSON.stringify({ a: { b: "x", c: "y" } }));
    writeFileSync(join(dir, "ar.json"), JSON.stringify({ a: { b: "x" } }));
    expect(run(dir)).toBe(1);
  });
});
