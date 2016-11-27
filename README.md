<img align="right" src="data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="0" height="150" border="0"><img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">
# CSSOBJ

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)
[![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

CSS in JS solution, create [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) and CSS rules from js, features:

 - **CSS Rules** create and diff
 - [Conditional apply CSS (good for SPA)](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [CSS modules with local class](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Auto vendor prefixer](https://www.browserstack.com/screenshots/a9be7bfdfa92aeb75a9a74465ef772c9fb1e424a)
 - [Media query for old browsers](https://www.browserstack.com/screenshots/2930c65da0fefc313c9827cfb7b77a8be03a9207)
 - [Dynamically change CSS](https://cssobj.github.io/cssobj-demo/#demo1)

Light weight (**4K gzipped**), Well [Tested](https://github.com/cssobj/cssobj#test), Easy to use (example in [Wiki](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib))

[API](https://github.com/cssobj/cssobj/blob/master/docs/api.md) - [Live Demo](https://cssobj.github.io/cssobj-demo/) - [Github Repo](https://github.com/cssobj/cssobj) - [LESS in JS](https://github.com/futurist/cssobj-less)

[![CSSOBJ Screenshot](demo-box.gif)](https://cssobj.github.io/cssobj-demo/#demo1)

### Browser Compatible

- All modern browsers
- IE >= 6
- Android Safari >= 4.1
- iOS Safari >= 5

## Why?

For a long time, changing CSS is via **DOM.style**, like below:

``` javascript
// vanilla
document.getElementById('domID').style.color = 'red'
document.getElementById('domID').style.fontSize = '14px'

// jquery
$('div').css({color:'red', fontSize:'14px'})  // all the DIVs!
```

**But, it's not updating CSS rules**, and may have [performance issues](http://www.quirksmode.org/dom/classchange.html)

[CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) is the base of browser, have good Javascript API, why not using it?

This lib is modern CSSOM **create** and **diff** engine, see below:

```javascript
/* script in your <head> */
const obj = {'.nav': {color:'red', fontSize:'12px'}}
const ret = cssobj(obj)
```

it will create `<style>` tag in **head**, with below CSS:

``` css
.nav { color: red; font-size: 12px; }
```

Want to update the rule?

```javascript
obj['.nav'].color = 'blue'
ret.update()
```

The CSS will be changed as:

``` css
.nav { color: blue; font-size: 12px; }
```

See, no wait for **DOM**, no `window.onload`, all **.nav** will have it's style changed.

## Install:

**npm**

``` bash
npm install cssobj  # the lib

npm install -g cssobj-converter  # CLI tool (optional)
```

## Quick Start:

- **Step 1**

Write your CSS as normal (e.g. *index.css*), e.g.:

``` css
.nav { color: blue; }
```

- **Step 2**

Convert CSS file *index.css* into *index.css.js* as JS module, using [cssobj CLI tool](https://github.com/cssobj/cssobj-converter):

``` bash
cssobj index.css -o index.css.js
```

The content of `index.css.js` as below (**common js** module):

``` javascript
module.exports = {
  '.nav': { color: 'blue' }
}
```

- **Step 3**

Let's rock:

``` javascript
// import your css module
const obj = require('./index.css.js')

// create new <style> tag into html head, with rules in obj.
const result = cssobj(obj, {local: true})

// update some rule
obj['.nav'].color = 'red'
obj['.nav'].fontSize = '12px'
result.update()

// get localized class name
result.mapSel('.nav')  // .nav_ioei2j1_

```

### For more usage, please check [Usage & Example](https://github.com/cssobj/cssobj/blob/master/docs/usage-example.md)

## How it worked?

1. **cssobj** first parse js object into **Virtual CSSOM** middle format.

2. The internal [cssom](https://github.com/cssobj/cssobj-plugin-cssom) plugin will create stylesheet dom, and apply rules from middle format.

3. When the js object changed, **cssobj** will diff CSSOM rules (**add/delete/change**) accordingly. (see [demo](https://cssobj.github.io/cssobj-demo/#demo1))

## [check here for API docs](https://github.com/cssobj/cssobj/blob/master/docs/api.md)

## Plugins

- [cssobj-plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) Localize class names in selector

- [cssobj-plugin-default-unit](https://github.com/cssobj/cssobj-plugin-default-unit) Add default unit to numeric values, e.g. width / height

- [cssobj-plugin-gencss](https://github.com/cssobj/cssobj-plugin-gencss) Generate css text from virtual css

- [cssobj-plugin-cssdom](https://github.com/cssobj/cssobj-plugin-cssom) Add style dom to head and update rules from virtual css diff result

- [cssobj-plugin-stylize](https://github.com/cssobj/cssobj-plugin-stylize) Add style dom to head then update css from gencss plugin, small in size

- [cssobj-plugin-csstext](https://github.com/cssobj/cssobj-plugin-csstext) Display cssText from CSSOM

- [cssobj-plugin-replace](https://github.com/cssobj/cssobj-plugin-replace) Replace cssobj object key/value pair with new value

- [cssobj-plugin-extend](https://github.com/cssobj/cssobj-plugin-extend) Extend selector to another selector, like @extend in SCSS or $extend in LESS

- [cssobj-plugin-keyframes](https://github.com/cssobj/cssobj-plugin-keyframes) Make keyframes rules localized, also apply to `animation` and `animation-name`

## Demos

[cssobj-demo](https://github.com/cssobj/cssobj-demo)

## Tools

[cssobj-converter](https://github.com/cssobj/cssobj-converter) Try [Online Version](http://convertcssobj-futurist.rhcloud.com/)

## Helpers

[cssobj-mithril](https://github.com/cssobj/cssobj-mithril) Help cssobj to work with [mithril](https://github.com/lhorie/mithril.js)

## Test

Using [phantom](http://phantomjs.org/) 2.0 to test with CSSOM. Please see **test/** folder.

## Remark

cssobj is wrapper for [cssobj-core](https://github.com/cssobj/cssobj-core), [plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) and [plugin-cssom](https://github.com/cssobj/cssobj-plugin-cssom).

## License

MIT

