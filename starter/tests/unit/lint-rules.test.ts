import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import warsha from "../../eslint-rules/index.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
});

tester.run("no-physical-direction", warsha.rules["no-physical-direction"], {
  valid: [
    { code: `<div className="ms-4 pe-2 text-start border-e start-0 rounded-s-md" />` },
    { code: `<div className="px-4 mx-auto" />` },
    { code: `const label = "left-hand side";` },
  ],
  invalid: [
    { code: `<div className="ml-4" />`, errors: 1 },
    { code: `<div className="md:pr-2 hover:text-left" />`, errors: 2 },
    { code: "cn(`left-0 ${x}`, 'border-r')", errors: 2 },
    { code: `cva("rounded-l-md -mr-1")`, errors: 2 },
  ],
});

tester.run("no-manual-format", warsha.rules["no-manual-format"], {
  valid: [{ code: `format.dateTime(d, { dateStyle: "long" })` }, { code: `n.toFixed(2)` }],
  invalid: [
    { code: `d.toLocaleDateString("en")`, errors: 1 },
    { code: `n.toLocaleString()`, errors: 1 },
    { code: `new Intl.NumberFormat("en").format(n)`, errors: 1 },
  ],
});
