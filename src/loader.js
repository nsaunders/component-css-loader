import postcssLoader from "postcss-loader";
import prefixer from "postcss-prefixer";
import prefixKeyframe from "postcss-prefix-keyframe";
import { validate } from "schema-utils";

export default function (content, ...args) {
  const options = {
    prefix: "[moduleId]___",
    css: "css",
    ...this.getOptions({
      title: "Component CSS Loader",
      type: "object",
      properties: {
        prefix: {
          type: "string",
        },
        css: {
          type: "string",
        },
      },
    }),
  };

  let json;
  try {
    json = JSON.parse(content);
  } catch ({ message }) {
    throw new Error(
      `Component CSS Loader requires valid JSON input. ${message}`,
    );
  }

  const prefixFieldsPattern = /\[([^[]+)\]/g;
  const prefixFields = (options.prefix.match(prefixFieldsPattern) || []).map(
    x => x.substring(1, x.length - 1),
  );

  validate(
    {
      title: "Component CSS Loader content",
      type: "object",
      required: [...prefixFields, options.css],
      properties: {
        ...prefixFields.reduce(
          (acc, field) => ({ ...acc, [field]: { type: "string" } }),
          {},
        ),
        [options.css]: {
          type: "string",
        },
      },
    },
    json,
  );

  const prefix = options.prefix.replace(
    prefixFieldsPattern,
    (_, key) => json[key],
  );
  const css = json[options.css];

  return postcssLoader.call(
    {
      ...this,
      getOptions: () => postcssOptions(prefix),
    },
    css,
    ...args,
  );
}

function postcssOptions(prefix) {
  return {
    postcssOptions: {
      plugins: [prefixer, prefixKeyframe].map(plugin => plugin({ prefix })),
    },
  };
}
