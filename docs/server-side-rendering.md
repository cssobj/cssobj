# Server Side Rendering

Render css object in server side, you need [cssobj-core](https://github.com/cssobj/cssobj-core) and [cssobj-plugin-gencss](https://github.com/cssobj/cssobj-plugin-gencss)

```Javascript
const cssobj_core = require('cssobj-core')
const cssobj_plugin_gencss = require('cssobj-plugin-gencss')

const cssobj = cssobj_core({
  plugins: [
    cssobj_plugin_gencss({indent:'\t', newLine: '\n'})
  ]
})

console.log(cssobj(your_obj1).css)
console.log(cssobj(your_obj2).css)

```

But the generated CSS don't have prefixered, you should add vendor prefix by some server side package.





