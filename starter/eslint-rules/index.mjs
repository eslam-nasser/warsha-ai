// Warsha lint rules. Source: docs/spec.md in the Warsha repo, section Localization.

const CLASS_CALLEES = new Set(["cn", "cva", "clsx", "twMerge"]);

// Physical-direction Tailwind classes. Use start and end instead: ms-, pe-, start-, text-start, border-e, rounded-s.
const PHYSICAL = [
  /^-?(m|p|scroll-m|scroll-p)[lr]-/,
  /^-?(left|right)-/,
  /^text-(left|right)$/,
  /^border-[lr](-|$)/,
  /^rounded-([lr]|tl|tr|bl|br)(-|$)/,
  /^(float|clear)-(left|right)$/,
];

function physicalClasses(value) {
  return value
    .split(/\s+/)
    .map((token) => token.split(":").pop().replace(/^!/, ""))
    .filter((cls) => PHYSICAL.some((re) => re.test(cls)));
}

function inClassContext(sourceCode, node) {
  for (const a of sourceCode.getAncestors(node).reverse()) {
    if (a.type === "JSXAttribute") return ["className", "class"].includes(a.name?.name);
    if (a.type === "CallExpression") {
      const name = a.callee.type === "Identifier" ? a.callee.name : a.callee.property?.name;
      if (CLASS_CALLEES.has(name)) return true;
    }
  }
  return false;
}

/** @type {import("eslint").Rule.RuleModule} */
const noPhysicalDirection = {
  meta: {
    type: "problem",
    docs: { description: "Use logical start and end classes so the layout flips for right-to-left" },
    schema: [],
    messages: { physical: "'{{cls}}' is a left or right class. Use the start or end version (ms-, pe-, start-, text-start, border-e, rounded-s)." },
  },
  create(context) {
    const check = (node, value) => {
      if (typeof value !== "string" || !inClassContext(context.sourceCode, node)) return;
      for (const cls of physicalClasses(value)) context.report({ node, messageId: "physical", data: { cls } });
    };
    return {
      Literal: (node) => check(node, node.value),
      TemplateElement: (node) => check(node, node.value.cooked),
    };
  },
};

const FORMAT_METHODS = new Set(["toLocaleDateString", "toLocaleTimeString", "toLocaleString"]);
const INTL_FORMATTERS = new Set(["DateTimeFormat", "NumberFormat", "RelativeTimeFormat", "ListFormat", "PluralRules"]);

/** @type {import("eslint").Rule.RuleModule} */
const noManualFormat = {
  meta: {
    type: "problem",
    docs: { description: "Format dates and numbers through the next-intl formatter" },
    schema: [],
    messages: {
      method: "Do not call {{name}}(). Use useFormatter() or getFormatter() from next-intl.",
      intl: "Do not create Intl.{{name}} directly. Use useFormatter() or getFormatter() from next-intl.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const name = node.callee.type === "MemberExpression" ? node.callee.property?.name : null;
        if (FORMAT_METHODS.has(name)) context.report({ node, messageId: "method", data: { name } });
      },
      NewExpression(node) {
        const c = node.callee;
        if (c.type === "MemberExpression" && c.object?.name === "Intl" && INTL_FORMATTERS.has(c.property?.name)) {
          context.report({ node, messageId: "intl", data: { name: c.property.name } });
        }
      },
    };
  },
};

const plugin = {
  meta: { name: "eslint-plugin-warsha" },
  rules: { "no-physical-direction": noPhysicalDirection, "no-manual-format": noManualFormat },
};

export default plugin;
