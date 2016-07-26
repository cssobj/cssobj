# CSSOBJ

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)

CSSOBJ is a light weight javascript library for rendering and diff CSS from javascript with CSSOM in browsers, using virtual CSS technology. Features include: at media stylesheet rule support for old browsers, localized class names, dynamic caculation and update css, hot replacement for css rules.

[Live demo](https://cssobj.github.io/cssobj-demo/)

[![CSSOBJ Screenshot](demo-box.gif)](https://cssobj.github.io/cssobj-demo/)

## Install:

Download this repo, and check the dist folder.

This project currently not published to `npmjs`, please using below to install from github directly:

``` javascript
npm install cssobj/cssobj
```

## Usage:

### Case 1: you want local class names

Think below normal stylesheet:

``` html
<style>
  body { color: red; }
  .item  { font-size: 12px; }
  .item span { color: blue; }
</style>
```

You will have the **pain** by sharing to others with class name conflict, so

#### Using *cssobj* instead:

Include **dist/cssobj.min.js** (**3K gzipped**) into `<head>`, add code below:

``` html
<script src="dist/cssobj.min.js"></script>
<script>
var obj = {
  body: {
    color:'red'
  },
  '.item': {
    fontSize: '12px',
    span: { color: 'blue' }
  }
}
var result = cssobj(obj)
</script>
```

This will generate [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) in your `<head>`, with below css:

``` css
body {
  color: red;
}
._1jkhrb92_item {
  font-size: 12px;
}
._1jkhrb92_item span {
  color: blue;
}
```

Class names will add a random prefix, you can get the class name using below:

``` javascript
result.map['item']   // == _1jkhrb92_item
```

You can also specify your own `prefix`.

``` javascript
var result = cssobj(obj, {prefix:'_yourown_'})
// .item -> ._yourown_item
```

### Case 2: you want dynamicly update you css rule

Does javascript already do the job?

``` javascript
document.getElementById('domID').style.color = 'red'
document.getElementById('domID').style.fontSize = '14px'
```

or jQuery:

``` javascript
$('div').css({color:'red', fontSize:'14px'})
```

Yes, but the first code is poorly, the second code need jQuery lib and the DOM ready, and have performance issue. ALL of them is not updating css rules.

[CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) is the base of a browser, and it's javascript ready, why not using it?

#### Using *cssobj* instead:

Think at first your style sheet as below:

``` javascript
var obj = {
  div: {fontSize:'12px'}
}
var css = cssobj(obj)
```

Then all your `div`(current and future added!) will have the rule.

Then you want to update the rule as below:

``` javascript
obj.div = {color:'red', fontSize:'14px'}
css.update()
```
Then all your `div` (current and future added!) will have the new rule.

The performance will only depend on the browser's CSSOM engine.

### Case 3: you want @media rule work in old Browsers

Just try this [demo](https://cssobj.github.io/cssobj-demo/play/), in IE 8, or IE 7, or IE 5!

## How it worked?

1. **cssobj** first parse js object into **Virtual CSS** middle format.

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

### 4. @media support in old browsers

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

Then `div` will have color as **red**, **green** and **blue** accordingly, in **ALL BROWSERS** (IE5+, except IE6, contribution welcome!)

[Demo](https://cssobj.github.io/cssobj-demo/play/) here for **@media (min-width), (max-width)** support for old browsers.

Below is the screencast with **@media** rule response support in **IE 5** (oh my!)

[![CSSOBJ @media support](demo-media.gif)](https://cssobj.github.io/cssobj-demo/play/)

### 5. Localized class names

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

### 6. Small and smart

Only one js file with no dependencies, **3K** gzipped.

Easy to plugin, and there're plenty of them.

Virtual CSS middle format is JS object, thus can avoid the differences of CSS engines, dynamicly caculated.

## API

### `var result = cssobj(obj, options)`

> parse obj, generate virtual css, then render `<style>` tag into `<head>`

#### *PARAMS*

#### `obj`

Type: **{object|array}**

Nothing special, just plain js `Object`, or `Array` of `Object`, with below rules:

* non-object(`string|number`) value act as css value.

* if value is object, key will act as css selector.

* if value is non-object, key will act as css property.

#### `options`

Type: **{object}**

name | type | default | description
-----|-----|-----------|---------------
local | Boolean | true | `true` to localize class names, using `options.prefix` if defined, or using native `random` function.
prefix | String | random string | prefix for localized names, will using `random()` function in [cssobj-helper](https://github.com/cssobj/cssobj-helper) if not specified or as falsy.
localNames | Object | { } | predefined `key - val` to control each class name when localized.
plugins | Object | { } | supported key is `post`, `value`, `selector`, each must be function or array of functions.

#### *RETURN*

cssobj `RESULT` object


### `RESULT` OBJECT

The return value of `cssobj()` and `result.update()`, it's a js object with below keys:

name | type | description
-----|-----|-----------
obj | Object | The source js object for `cssobj()` function call.
root | Object | Virtual CSS object parsed from `obj`, mainly used for value functions and plugins.
nodes | Array | Array of virtual css nodes, for the convinence of `filter` or `map` etc.
map | Object | Key/value pairs for localized class names, key is original class name in source `obj`, value is localized name.
ref | Object | Key/value pairs for named objects. Named objects is objects with `$id` string value in `obj`.
update | Function | Update the `RESULT` object from `obj`, generate `diff`, update CSSOM and all relevent data. Function signature is `function([data]) {} -> result`
-  | param:<br>data | [optional] Passed to `update()` function, and set to `RESULT` `data` value, for later use.
diff | Object | Set from `update()` function, with `added`, `removed`, `changed` nodes and props.
data | Object | Store for data parameter of `update()` function, can be referenced and changed in object functions and plugins.
options | Object | Store for `cssobj()` `options` parameter, can be referenced and changed in object functions and plugins.
cssdom | Stylesheet<br>Element | Style sheet element generated by `cssobj()` function. Each call of `cssobj()` will generate a new cssdom. `update()` function only update cssdom with `diff` result.

## Plugins

- [cssobj-plugin-value-default-unit](https://github.com/cssobj/cssobj-plugin-value-default-unit) Add default unit to numeric values, e.g. width / height

- [cssobj-plugin-post-gencss](https://github.com/cssobj/cssobj-plugin-post-gencss) Generate css text from virtual css

- [cssobj-plugin-post-cssdom](https://github.com/cssobj/cssobj-plugin-post-cssom) Add style dom to head and update rules from virtual css diff result

- [cssobj-plugin-post-stylize](https://github.com/cssobj/cssobj-plugin-post-stylize) Add style dom to head then update css from gencss plugin, small in size

## Demos

[cssobj-demo](https://github.com/cssobj/cssobj-demo)

## Tools

[cssobj-converter](https://github.com/cssobj/cssobj-converter)

## Test

Using [phantom](http://phantomjs.org/) to test with CSSOM.

## License

MIT © James Yang
