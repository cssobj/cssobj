# CSSOBJ

CSSOBJ is css object in javascript for the modern web. Works in old & modern Browsers.

[Live demo](https://cssobj.github.io/cssobj-demo/)

![CSSOBJ Screenshot](demo-box.gif)

## Usage:

Think below normal stylesheet:

```html
<style>
  body { color: red; }
  div  { font-size: 12px; }
  div span { color: blue; }
</style>
```

#### Using *cssobj* instead:

Get *cssobj* lib from [dist/](https://github.com/cssobj/cssobj/tree/master/dist), Drop **cssobj.min.js** (**3K gzipped**) into script tag in the `<head>`:

```html
<script src="path/to/cssobj.min.js"></script>
```

Then add javascript code as below:

```html
<script>
var obj = {
  body: {
    color:'red'
  },
  div: {
    fontSize: '12px',
    span: { color: 'blue' }
  }
}
var result = cssobj(obj)
</script>
```

You will get same style in your `<head>`.

## How it worked?

1. **cssobj** first parse js object into **Virtual CSSOM** middle format.

2. The internal [CSSOM](https://github.com/cssobj/cssobj-plugin-post-cssom) plugin will create stylesheet dom, and add rules from middle format.

3. When the js object changed, **cssobj** will update CSSOM rules accordingly.

## Benefit

What's the benefit? See below:

### 1. Live update

```js
obj.div.fontSize = '16px'
result.update()
```

Then the actual style sheet will update the `div` selector rule, set `font-size` to `16px`.

### 2. Dynamic caculation

```js
obj.div.width = function(){ return window.innerWidth / 3 + 'px' }
obj.div.height = function(){ return this.width }
result.update()
```

Then all the `div` will have same width & height, as 1/3 of window width, magicly!

### 3. Hot replacement

```js
obj.div.span = {color:'green', marginLeft: '20px'}
result.update()
```

Then the old `span` selector will be replaced by the new rule.

### 4. @media rules in old browsers

```js
cssobj({
  div:{ color:'red' },
  '@media (max-width: 768px)':{
    div:{ color:'green' },
    '@media (min-width: 480px)':{
      div:{ color:'blue' }
    }
  }
})
```

Then `div` will have color as **red**, **green** and **blue** accordingly, in **ALL BROWSERS** (except IE6, contribution welcome!)

Below is the screencast in **IE 5** (oh my!) for [@media demo page](https://cssobj.github.io/cssobj-demo/play/)

![CSSOBJ @media support](demo-media.gif)

### 5. Local class names

```js
var ret = cssobj({
  body:{ color:'red' },
  '.item':{ color:'blue' }
})
```

will get CSSOM as below:

```css
body { color: red; }
._1c0b3bn4_nav { color: red; }
```

There's no class name conflict. You can customize the `prefix` as you need, or turn off this feature.


## API

### `var result = cssobj(obj, options)`

> Generate CSSOM `<style>` tag into `<head>`, parsed from js object, using options

### `obj`

Type: **{object|array}**

Nothing special, just plain js `Object`, or `Array` of `Object`, with below rules:

* non-object(`string|number`) value act as css value.

* if value is object, key will act as css selector.

* if value is non-object, key will act as css property.

### `options`

Type: **{object}**

name | type | default | description
-----|-----|-----------|---------------
local | Boolean | true | `true` to localize class names, using `options.prefix` if defined, or using native `random` function.
prefix | String | random string | prefix for localized names, will using `random()` function in [cssobj-helper](https://github.com/cssobj/cssobj-helper) if not specified or as falsy.
localNames | Object | { } | predefined `key - val` to control each class name when localized.
plugins | Object | { } | supported key is `post`, `value`, `selector`, each must be function or array of functions.

## License

MIT © James Yang
