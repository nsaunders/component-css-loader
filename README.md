# component-css-loader <a href="https://github.com/nsaunders/component-css-loader/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/nsaunders/component-css-loader/ci.yml?branch=master" alt="Build status"></a> <a href="https://www.npmjs.com/package/component-css-loader"><img src="https://img.shields.io/npm/v/component-css-loader.svg" alt="Latest Release"></a> <a href="https://github.com/nsaunders/component-css-loader/blob/master/LICENSE"><img src="https://img.shields.io/github/license/nsaunders/component-css-loader.svg" alt="License"></a>

## Overview

This Webpack loader applies a prefix to each class name, ID, and animation name
that appears within a given style sheet. While similar functionality could be
achieved using e.g.
[postcss-loader](http://github.com/webpack-contrib/postcss-loader), the unique
feature of this loader is that the prefix is supplied in the source content
rather than within the Webpack configuration. Thus, a unique prefix can be
applied to each style sheet module, allowing independent scoping.

### Example

**Input**
```json
{
  "moduleId": "button",
  "css": ".container\n {\n  /*...*/\n}"
}
```

**Output**
```css
.button___container {
  /*...*/
}
```

## Options

**prefix**: string

A custom prefix to apply to classes, IDs, and animation names. Wrap the name of
each field you would like to include in square brackets.

For example, given the default value `[moduleId]___`, the loader will replace
the `[moduleId]` placeholder with the value of the `moduleId` field in the JSON
input.

**css**: string

A custom field name for CSS content. Defaults to `css`.

## FAQ

> The JSON content format is inconvenient and doesn't look like code I would
> normally write.

Indeed, the JSON content that this loader accepts as input would typically be
the output produced by another loader, such as
[execute-module-loader](https://github.com/nsaunders/execute-module-loader).
