# Server Side Rendering

While **cssobj** <kbd>=</kbd> [cssobj-core](https://github.com/cssobj/cssobj-core) <kbd>+</kbd> [plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) <kbd>+</kbd> [plugin-cssom](https://github.com/cssobj/cssobj-plugin-cssom)

For server rendering, replace **cssom** with **gencss**, that's not strictly indentical, but is the right config:

**Server Rendering** <kbd>=</kbd> [cssobj-core](https://github.com/cssobj/cssobj-core) <kbd>+</kbd> [plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) <kbd>+</kbd> [plugin-gencss](https://github.com/cssobj/cssobj-plugin-gencss)

```Javascript
const cssobj_core = require('cssobj-core')
const cssobj_plugin_localize = require('cssobj-plugin-localize')
const cssobj_plugin_gencss = require('cssobj-plugin-gencss')

const cssobj = cssobj_core({
  plugins: [
    // order is important
    cssobj_plugin_localize({space: 'your_space_name', localNames: {}})
    cssobj_plugin_gencss({indent:'\t', newLine: '\n'})
  ]
})

console.log(cssobj(your_obj1).css)
console.log(cssobj(your_obj2).css)

```

If you don't need localized class names (`result.mapSel` & `result.mapClass`), you should remove `cssobj_plugin_localize` lines in above.

## Caveat

The generated CSS don't have auto prefixed, you should use [autoprefixer](https://github.com/postcss/autoprefixer) or some thing.







