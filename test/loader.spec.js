/**
 * @jest-environment node
 */
import compiler from "./compiler.js";

test('under defaults, outputs prefixed CSS using "moduleId" and "css" values', async () => {
  const stats = await compiler("component-default.json");
  const {
    modules: [{ source }],
  } = stats.toJson({ source: true });
  const output = getOutput(source);
  expect(output).toEqual(
    "@keyframes component___fooa{from{opacity:0}to{opacity:1}}.component___fooc,#component___fooi{animation-name:component___fooa;}",
  );
});

test("under defaults, throws when input is not valid JSON", async () => {
  try {
    await compiler("invalid.json");
  } catch (errors) {
    return expect(
      findError("Prefix Loader requires valid JSON input.", errors),
    ).toBeTruthy();
  }
  throw new Error("No error thrown");
});

test("under defaults, throws when input has no `moduleId` field", async () => {
  try {
    await compiler("component-custom-module-id.json");
  } catch (errors) {
    return expect(
      findError("content misses the property 'moduleId'.", errors),
    ).toBeTruthy();
  }
  throw new Error("No error thrown");
});

test("under defaults, throws when input has no `css` field", async () => {
  try {
    await compiler("component-custom-css.json");
  } catch (errors) {
    return expect(
      findError("content misses the property 'css'.", errors),
    ).toBeTruthy();
  }
  throw new Error("No error thrown");
});

test("under `prefix` option, outputs custom prefix format", async () => {
  const stats = await compiler("component-default.json", {
    prefix: "[moduleId]_",
  });
  const {
    modules: [{ source }],
  } = stats.toJson({ source: true });
  const output = getOutput(source);
  expect(output).toEqual(
    "@keyframes component_fooa{from{opacity:0}to{opacity:1}}.component_fooc,#component_fooi{animation-name:component_fooa;}",
  );
});

test("under `prefix` option, throws an error when non-existent field is referenced", async () => {
  try {
    await compiler("component-default.json", { prefix: "[unknown]" });
  } catch (errors) {
    return expect(
      findError("content misses the property 'unknown'.", errors),
    ).toBeTruthy();
  }
  throw new Error("No error thrown");
});

test("under `css` option, outputs CSS sourced from custom field", async () => {
  const stats = await compiler("component-custom-css.json", {
    css: "styleSheet",
  });
  const {
    modules: [{ source }],
  } = stats.toJson({ source: true });
  const output = getOutput(source);
  expect(output).toEqual(
    "@keyframes component___fooa{from{opacity:0}to{opacity:1}}.component___fooc,#component___fooi{animation-name:component___fooa;}",
  );
});

test("under `css` option, throws an error when non-existent field is referenced", async () => {
  try {
    await compiler("component-custom-css.json", { css: "xyz" });
  } catch (errors) {
    return expect(
      findError("content misses the property 'xyz'.", errors),
    ).toBeTruthy();
  }
  throw new Error("No error thrown");
});

function getOutput(content) {
  if (!content.startsWith("export default ")) {
    throw new Error("Unexpected format. Check getOutput() test function.");
  }
  return JSON.parse(
    content.replace(/^export\sdefault\s/, "").replace(/;$/, ""),
  );
}

function findError(message, errors) {
  return errors.find(error => {
    return error?.message?.includes(message);
  });
}
