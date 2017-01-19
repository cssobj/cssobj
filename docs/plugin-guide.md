# Plugin Guide
How to write a plugin for cssobj? see below

## Plugin Format

A plugin is an js object passed into `plugins` array of config (2nd) argument with cssobj call:

```javascript
cssobj(obj, { plugins: [plugin1, plugin2, ...] })
```

All plugins just plain Javascript Objects, use `type: function` as key/value pair, like below:

```javascript
cssobj(obj, { plugins: [
    { selector: (selector) => { return another_selector } },  // plugin1: changed to another_selector
    { value: (value, prop) => { return another_value } },  // plugin2: changed to another_value
    ...
]})
```

## Plugin Type

Currently cssobj support below types

### **selector**: `function (selector: string, node: Node, result: Result) -> string`

  `selector` is current selector name according to CSS,
  including normal `@-rules`, **but except for** group @-rules
  `@media`, `@document`, `@supports`, `@page`, `@keyframes`

  It's not recommanded to change above gorup @-rules, if you want doing so, use `node.groupText`

  For `node` and `result` Object members, please see: [Type Definition](https://github.com/cssobj/cssobj/blob/master/index.d.ts#L34)

  Example plugin: add a container class to all selectors:

  ```javascript
  const plugin1 = {
    selector: sel => sel[0]=='@'
      ? sel  // unchanged
      : '.container ' + sel
  }
  cssobj({p: {color: 'red'}}, { plugins: [plugin1] })
  // .container p {color: red;}
  ```

  See also: [cssobj-plugin-localize](https://github.com/cssobj/cssobj-plugin-localize)

### **value**: `function (value: string, key: string, node: Node, result: Result) -> string`

  `value` is the value according to raw `JS Source Object Value`

  `key` is the key according to raw `JS Source Object Value`

  For `node` and `result` Object members, please see: [Type Definition](https://github.com/cssobj/cssobj/blob/master/index.d.ts#L34)

  Example plugin: double the number of value, and add `px`, if it's width/height

  ```javascript
  const plugin2 = {
    value: (val, sel) => /width|height/.test(sel)
      ? val * 2 + 'px'
      : val  // unchanged
  }
  cssobj({p: {width: 100}}, { plugins: [plugin2] })
  // p {width: 200px}
  ```

  See also: [cssobj-plugin-default-unit](https://github.com/cssobj/cssobj-plugin-default-unit)

### **post**: `function (result: Result) -> string`

  Do something with cssobj `result` object, like generate css text, do sth with `<style>` tag, etc.

  For `result` Object members, please see: [Type Definition](https://github.com/cssobj/cssobj/blob/master/index.d.ts#L34)

  See: [cssobj-plugin-gencss](https://github.com/cssobj/cssobj-plugin-gencss)

## Code Style

  As a convention of [existing plugins](https://github.com/cssobj/cssobj#plugins), plugin author can use below style:

### wrap plugin object into a **function call**, with below signature:

  `function(option: Object) -> Object({ plugin_type: function })`

  The function should accept **only one** argument, `option` can be Object that contain many member value

### use [helper functions](https://github.com/cssobj/cssobj-helper) when possible

  The helper functions are used in core and many plugins, use them will benefit for better optimization (size, compatibility, etc.)
