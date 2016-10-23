<img align="right" src="data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="0" height="150" border="0"><img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">
# CSSOBJ

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj) [![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj) [![npm](https://img.shields.io/npm/l/cssobj.svg "License")](#)


CSS in JS solution, create [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) and CSS rules from js, features:

 - **CSS Rules** create and diff
 - [Conditional apply CSS (good for SPA)](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [CSS modules with local class](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Auto vendor prefixer](https://www.browserstack.com/screenshots/a9be7bfdfa92aeb75a9a74465ef772c9fb1e424a)
 - [Media query for old browsers](https://www.browserstack.com/screenshots/2930c65da0fefc313c9827cfb7b77a8be03a9207)
 - [Dynamically change CSS](https://cssobj.github.io/cssobj-demo/#demo1)

Light weight (**3K gzipped**), Well [Tested](https://github.com/cssobj/cssobj#test), Easy to use (example in [Wiki](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib))

[Live Demo](https://cssobj.github.io/cssobj-demo/)  -  [Github Repo](https://github.com/cssobj/cssobj) - [LESS in JS](https://github.com/futurist/cssobj-less)

[![CSSOBJ Screenshot](demo-box.gif)](https://cssobj.github.io/cssobj-demo/#demo1)



## Why?

For a long time, changing CSS is via **DOM.style**, like below:

``` javascript
// vanilla
document.getElementById('domID').style.color = 'red'
document.getElementById('domID').style.fontSize = '14px'

// jquery
$('div').css({color:'red', fontSize:'14px'})  // all the DIVs!
```

**BUT ALL of above is not updating CSS rules**, and may have performance issues.

[CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) is the base of browser, have good Javascript API, why not using it?

**cssobj** is the modern CSSOM **generation** and **diff** engine, see below:

```javascript
/* script in your <head> */
var obj = {div: {color:'red', fontSize:'12px'}}
var ret = cssobj(obj)
```

Then all `div` will have **color: red;**, currently and future!

Want to dynamicly update?

```javascript
/* script in your <head> */
obj.div.color = 'blue'
ret.update()
```

Then all `div` will have css **color: blue;**. No jQuery, no wait for **DOM**, no `window.onload`!

 - **You never need to wait for DOM any more**

 - **cssobj will only update changed value, good for performance!**

## Install:

**npm**

``` bash
npm install cssobj  # the lib

npm install -g cssobj-converter  # the cli (optional)

# Use the cli:
cssobj abc.css -o abc.js # css -> js
cssobj ./css/            # convert the whole folder
```

Recommanded to install the [cli converter](https://github.com/cssobj/cssobj-converter) above!

**bower**

``` bash
bower install cssobj  # the lib
```

## Quick Start:

Including **dist/cssobj.min.js** into `<head>`, using as below:

### - Conditional apply CSS [demo](https://cssobj.github.io/cssobj-demo/test/test.html)

```javascript
var obj = {
  p: [{
    $test: function(){return true},
    color: 'blue'
  }, {
    $test: function(){return false},
    color: 'red'
  }]
}
var result = cssobj(obj)
```

The CSS is: `p {color: blue;}`

### - local class names

```javascript
var obj = {
  body: {
    color:'red'
  },
  '.item': {
    fontSize: '12px',
    span: { color: 'blue' }
  }
}
var result = cssobj(obj, {local:true})  // { local: {prefix:'my-prefix-'} }
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

Class names will add a random prefix, you can get class name using below:

``` javascript
/* want localized CSS Selector, use mapSel */
result.mapSel('ul#nav.list')   // === "ul#nav._1jkhrb92_list"

/* want localized space separated class names (W/O DOT), use mapClass */
result.mapClass('item active')   // === "_1jkhrb92_item _1jkhrb92_active"
```

### - Dynamicly update you css rule

``` javascript
var obj = {
  div: {fontSize:'12px'}
}
var css = cssobj(obj)
```

If you want to update the rule later:

``` javascript
... ...
obj.div.fontSize = '14px'
css.update()
```

### - @media rule work in old Browsers

Just try this [demo](https://cssobj.github.io/cssobj-demo/play/), in IE 5,6,7,8!

### - Auto vendor prefixer

**cssobj** will detect current browser's `vendor prefix`, and auto prefix when the property is invalid for style.

``` javascript
var obj = {
  button: {
    // will prefix for current browser
    appearance: 'none',
    borderImage: 'url(border.png)'
  }
}
var css = cssobj(obj)
```

[Test Demo](https://cssobj.github.io/cssobj-demo/button/) - [BrowserStack Snapshot](https://www.browserstack.com/screenshots/11918d3edc8e3db6c046f228364dbec526b1b3ec)

### - IFrame support

Use with `<iframe>` is easy:

```js
iframe.onload = function(e){
  cssobj(obj, {cssom: { frame: iframe }})
}
```

## How it worked?

1. **cssobj** first parse js object into **Virtual CSSOM** middle format.

2. The internal [plugin-cssom](https://github.com/cssobj/cssobj-plugin-cssom) will create stylesheet dom, and apply rules from middle format.

3. When the js object changed, **cssobj** will diff CSSOM rules (**add/delete/change**) accordingly. (see [demo](https://cssobj.github.io/cssobj-demo/#demo1))


## Benefit

What's the benefit?

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

Then `div` will have color as **red**, **green** and **blue** accordingly, in **ALL BROWSERS** (tested Modern & IE5+)

[Demo](https://cssobj.github.io/cssobj-demo/play/) here for **@media (min-width), (max-width)** support for old browsers.

Below is the screencast with **@media** rule response support in **IE 5** (oh my!)

[![CSSOBJ @media support](demo-media.gif)](https://cssobj.github.io/cssobj-demo/play/)

### 5. Localized class names

```js
var ret = cssobj({
  body:{ color:'red' },
  '.item':{ color:'blue' }
}, {local : true} )
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

Virtual CSSOM middle format is JS object, thus can avoid the differences of CSS engines, dynamicly caculated.

## API

### `var result = cssobj(obj, options)`

parse obj, generate virtual css, then render `<style>` tag into `<head>`

#### *PARAMS*

#### `obj`

Type: **{object|array}**

Nothing special, just plain js `Object`, or `Array` of `Object`, with below rules:

* non-object(`string|number`) value act as css value.

* if value is object, key will act as css selector.

* if value is non-object, key will act as css property.

##### [more rules can be found here](docs/cssobj-object-format.md)

#### `options`

Type: **{object}**

name | type | default | description
-----|-----|-----------|---------------
intros | Array | Objects or functions to return as preset css objects, which will combined into user passed source object.
local | Boolean or Object | false | `true` to localize class names, using `options.local.prefix` as prefix.
local.prefix | String | random string | prefix for localized names, will using `random()` function in [cssobj-helper](https://github.com/cssobj/cssobj-helper) if not specified or as falsy.
local.localNames | Object | { } | predefined `key - val` to control each class name when localized.
cssom | Object | { } | `cssom-plugin` option, supported key: `frame` as iframe DOM, `name` of style id, `attrs` for style tag.
plugins | Array | Functions to add different feature, for `post`, `value`, `selector`, see [plugins](#plugins) section.

#### *RETURN*

cssobj `RESULT` object


### `RESULT` OBJECT

The return value of `cssobj()` and `result.update()`, it's a js object with below keys:

name | type | description
-----|-----|-----------
intro | Object | The source js object merged from `option.intros` array.
obj | Object | The source js object for `cssobj()` function call.
root | Object | Virtual CSSOM object parsed from `obj`, mainly used for value functions and plugins.
nodes | Array | Array of virtual css nodes, for the convinence of `filter` or `map` etc.
mapSel | Function | Input CSS selector string, return localized CSS selector string, this want to keep consistency with `h("ul#nav.list")` in any [hyperscript](https://github.com/dominictarr/hyperscript) or [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript). Function signature is `function({string} cssSelector){ return {string} mappedSelector }`.
mapClass | Function | Input space separated class list string **(WITHOUT DOT)**, return localized class list string, this want to keep consistency with `<div class="a b c"...` in HTML **class attribute**. Function signature is `function({string} classList){ return {string} mappedClassList }`.
ref | Object | Key/value pairs for named objects. Named objects is objects with `$id` string value in `obj`.
update | Function | Update the `RESULT` object from `obj`, generate `diff`, update CSSOM and all relevent data. Function signature is `function updater ([{object} data]) { return {object} result }`
-  | *updater param*:<br>data | [optional] Passed to `update()` function, and set to `RESULT` `data` value, for later use.
diff | Object | Set from `update()` function, with `added`, `removed`, `changed` nodes and props.
data | Object | Store for data parameter of `update()` function, can be referenced and changed in object functions and plugins.
options | Object | Store for `cssobj()` `options` parameter, can be referenced and changed in object functions and plugins.
cssdom | Stylesheet<br>Element | Style sheet element generated by `cssobj()` function. Each call of `cssobj()` will generate a new cssdom. `update()` function only update cssdom with `diff` result.

## Plugins

- [cssobj-plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) Localize class names in selector

- [cssobj-plugin-default-unit](https://github.com/cssobj/cssobj-plugin-default-unit) Add default unit to numeric values, e.g. width / height

- [cssobj-plugin-gencss](https://github.com/cssobj/cssobj-plugin-gencss) Generate css text from virtual css

- [cssobj-plugin-cssdom](https://github.com/cssobj/cssobj-plugin-cssom) Add style dom to head and update rules from virtual css diff result

- [cssobj-plugin-stylize](https://github.com/cssobj/cssobj-plugin-stylize) Add style dom to head then update css from gencss plugin, small in size

- [cssobj-plugin-csstext](https://github.com/cssobj/cssobj-plugin-csstext) Display cssText from CSSOM

- [cssobj-plugin-replace](https://github.com/cssobj/cssobj-plugin-replace) Replace cssobj object key/value pair with new value

- [cssobj-plugin-extend](https://github.com/cssobj/cssobj-plugin-extend) Extend selector to another selector, like @extend in SCSS or $extend in LESS


*More plugins welcome!*

## Demos

[cssobj-demo](https://github.com/cssobj/cssobj-demo)

## Tools

[cssobj-converter](https://github.com/cssobj/cssobj-converter) Try [Online Version](http://convertcssobj-futurist.rhcloud.com/)

## Helpers

[cssobj-mithril](https://github.com/cssobj/cssobj-mithril) Help cssobj to work with [mithril](https://github.com/lhorie/mithril.js)

*More helper welcome!*

## Test

Using [phantom](http://phantomjs.org/) 2.0 to test with CSSOM. Please see **test/** folder.

## Remark

cssobj is wrapper for [cssobj-core](https://github.com/cssobj/cssobj-core), [plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) and [plugin-cssom](https://github.com/cssobj/cssobj-plugin-cssom).

## Contribute

Yes! We need you! Any work you do will be helpful.

## License

MIT
