<img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">

# CSSOBJ
CSS in JS solution, **change stylesheet rules at runtime**, features:

 - **~4K min.gz**
 - **CSS Rules** create, diff
 - [Change rules at Runtime](https://cssobj.github.io/cssobj-demo/#demo1)
 - [TOOL to convert CSS](https://github.com/cssobj/cssobj-converter)
 - [Nested Child Selector](https://cssobj.github.io/cssobj-demo/#demoprefixer)
 - [Safety of Unicode/Comma/Ampersand](https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS)
 - [Conditional apply CSS](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [Local class names](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Auto vendor prefixer](http://1111hui.com/github/css/cssobj-demo/#demoprefixer)
 - [Media query hook](https://cssobj.github.io/cssobj-demo/#demomedia)
 - [Server Side Rendering](https://github.com/cssobj/cssobj/wiki/Server-Side-Rendering)
 - **Intuitive API**

[Wiki](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib) - [API](https://github.com/cssobj/cssobj/blob/master/docs/api.md) - [Live Demo](https://cssobj.github.io/cssobj-demo/) - [Github Repo](https://github.com/cssobj/cssobj)

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)
[![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Highlight

Render CSS string from js, localize for using in js components, it's not hard today, [there are many](https://github.com/cssobj/cssobj/wiki/Compared-with-similar-libs)

The hard part is **updating the rule**, rewrite the whole `<style>` tag with new string is **doing wrong**

**cssobj** using [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model), to **diff and udpate** at **CSS Property** level

Assume you have below CSS:

``` css
.nav { color: blue; }
.nav .item{ color: red; font-size: 12px; }
```

Render using CSSOBJ:

```javascript
import cssobj from 'cssobj'

const obj = {
  '.nav': {
    color: 'blue',
    '.item': {
      color: 'red',
      fontSize: '12px'
    }
  }
}
const result = cssobj(obj)
// will create <style>, insert 2 CSS rules
```

**Dynamically upate a rule**:

```javascript
obj['.nav'].color = 'orange'

result.update()
```

Above, **only** `color` prop in `.nav` rule updated, other rules and props will **keep untouched**.

That's it, see more [Usage & Example](https://github.com/cssobj/cssobj/blob/master/docs/usage-example.md)

## Install:

**npm** (CJS & ES)

``` bash
npm install cssobj  # the lib

npm install -g cssobj-converter  # CLI tool (optional)
```

**use in html** (IIFE)

``` html
<script src="https://unpkg.com/cssobj"></script>
```

## Quick Start:

- **Step 1**

Write your CSS as normal (e.g. *index.css*), e.g.:

``` css
.nav { color: blue; font-size: 12px; }
```

- **Step 2**

Convert CSS file *index.css* into *index.css.js* as JS module, using [cssobj CLI tool](https://github.com/cssobj/cssobj-converter):

``` bash
cssobj index.css -o index.css.js
```

The content of `index.css.js` as below (**Common JS** module):

``` javascript
module.exports = {
  '.nav': { color: 'blue', fontSize: '12px' }
}
```

- **Step 3**

Let's rock:

``` javascript
// import your css module
const obj = require('./index.css.js')

// create new <style> tag into html head, with rules in obj.
// local: true will put class names into local space
const result = cssobj(obj, {local: true})

// update some rule
obj['.nav'].color = 'red'
obj['.nav'].fontSize = function(prev){ return parseInt(prev) + 1 }  // increase font-size by 1
result.update()

// get localized class name

console.log(result.mapSel('.nav'))  // .nav_ioei2j1_

```

Let's quickly learn the API:

**only one** top level method: `cssobj( obj )`, all other things using `result.someMethods`, that's all, really.

#### [Documented API](https://github.com/cssobj/cssobj/blob/master/docs/api.md)


#### More to read:

  - **!important** [CSSOBJ Format](https://github.com/cssobj/cssobj/wiki/Input-Object-Format)

  - [Working with Babel/JSX](https://github.com/cssobj/cssobj/wiki/Working-with-Babel-JSX)

  - [Merge multiple objects](https://github.com/cssobj/cssobj/wiki/Merge-Multiple-Objects)

  - [Working with popular libs](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib)

  - [Working with Stream](https://github.com/cssobj/cssobj/wiki/Working-With-Stream)

  - [Server side rendering](https://github.com/cssobj/cssobj/wiki/Server-Side-Rendering)

## How it worked?

1. **cssobj** first parse js object into **Virtual CSSOM** middle format.

2. The internal [cssom](https://github.com/cssobj/cssobj-plugin-cssom) plugin will create stylesheet dom, and apply rules from middle format.

3. When the js object changed, **cssobj** will diff CSSOM rules (**add/delete/change**) accordingly. (see [demo](https://cssobj.github.io/cssobj-demo/#demo1))

## Tools

  Convert existing style sheet into *cssobj*:

  - [CLI Converter](https://github.com/cssobj/cssobj-converter) **Recommended** CLI tools to convert CSS. Run `npm -g cssobj-converter`

  - [Online Converter](http://convertcssobj-futurist.rhcloud.com/) It's free node server, slow, and unstalbe, not recommended

## Debug

  - [cssobj-helper-showcss](https://github.com/cssobj/cssobj-helper-showcss) Display css string from style tag, for DEBUG

## Plugins

  - **(already in core)** [cssobj-plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) Localize class names

  - **(already in core)** [cssobj-plugin-cssdom](https://github.com/cssobj/cssobj-plugin-cssom) Inject style to DOM and diff update

  - [cssobj-plugin-default-unit](https://github.com/cssobj/cssobj-plugin-default-unit) Add default unit to numeric values, e.g. width / height

  - [cssobj-plugin-flexbox](https://github.com/cssobj/cssobj-plugin-flexbox) Make flexbox working right with auto prefixer/transform

  - [cssobj-plugin-replace](https://github.com/cssobj/cssobj-plugin-replace) Merge cssobj Key/Value with new object

  - [cssobj-plugin-extend](https://github.com/cssobj/cssobj-plugin-extend) Extend to another selector, like [@extend](https://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend) in SCSS or [:extend](http://lesscss.org/features/#extend-feature) in LESS

  - [cssobj-plugin-keyframes](https://github.com/cssobj/cssobj-plugin-keyframes) Make keyframe names localized, and apply to `animation` and `animation-name`

  - [cssobj-plugin-gencss](https://github.com/cssobj/cssobj-plugin-gencss) Generate css text from Virtual CSS Node, for **Server Rendering**

## Helpers

  - [babel-plugin-transform-cssobj-jsx](https://github.com/cssobj/babel-plugin-transform-cssobj-jsx) Work with React, Vue etc. that can use babel+jsx

  - [cssobj-mithril](https://github.com/cssobj/cssobj-mithril) Help cssobj to work with [mithril](https://github.com/lhorie/mithril.js)

  - [cssobj-helper-stylize](https://github.com/cssobj/cssobj-helper-stylize) Add css string into style dom

## Demos

  - [cssobj-demo](https://github.com/cssobj/cssobj-demo)

## Test

Using [phantom](http://phantomjs.org/) 2.0 to test with CSSOM. Please see **test/** folder.

## Remark

cssobj is wrapper for [cssobj-core](https://github.com/cssobj/cssobj-core), [plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) and [plugin-cssom](https://github.com/cssobj/cssobj-plugin-cssom).

## License

MIT

