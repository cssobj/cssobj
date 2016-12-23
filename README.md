<img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">

# CSSOBJ
CSS in JS solution, **change stylesheet rules at runtime**, features:

 - **~4K min.gz**
 - **CSS Rules** create, diff
 - [Change rules at Runtime](https://cssobj.github.io/cssobj-demo/#demo1)
 - [Nested Child Selector](https://cssobj.github.io/cssobj-demo/#demoprefixer)
 - [Safety of Unicode/Comma/Ampersand](https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS)
 - [Conditional apply CSS](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [Local class names](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Auto vendor prefixer](http://1111hui.com/github/css/cssobj-demo/#demoprefixer)
 - [Media query hook](https://cssobj.github.io/cssobj-demo/#demomedia)

[Wiki](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib) - [API](https://github.com/cssobj/cssobj/blob/master/docs/api.md) - [Live Demo](https://cssobj.github.io/cssobj-demo/) - [Github Repo](https://github.com/cssobj/cssobj) - [Babel/JSX](https://github.com/cssobj/babel-plugin-transform-cssobj-jsx)

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)
[![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj)
[![Coverage Status](https://coveralls.io/repos/github/cssobj/cssobj-core/badge.svg?branch=master)](https://coveralls.io/github/cssobj/cssobj-core?branch=master)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[ie]: https://github.com/cssobj/cssobj/wiki/How-@media-work-in-IE8

## Highlight

Render CSS string from js, pack style sheet into js component, it's not hard today, [there are many](https://github.com/cssobj/cssobj/wiki/Compared-with-similar-libs)

The hard part is **dynamically update rules at runtime**, replace `<style>` tag with new string is **doing wrong**

**cssobj** using [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model), **diff object, udpate rule** at stylesheet **Property** level

In addition to many basic features of CSS-in-JS technology, cssobj is the **unique** lib that focus on:

 - **Stylesheet virtualization**

 - **Nested stylesheet optimization**, similar to [SCSS](http://sass-lang.com/)/[LESS](http://lesscss.org/) in browser, but tiny

 - [Dynamically change rules at run time](https://github.com/cssobj/cssobj/wiki/Dynamically-update-css)

 - [Use JS function as CSS value (Powerful!)](https://github.com/cssobj/cssobj/wiki/Function-as-CSS-Value)

 - [@media work under IE8][ie] (A bonus, add some IE8 bundle size (0.3K), no perf decreased)

Assume you have below CSS, `font-size` need to increase by 1 when user click

``` css
.nav { color: blue; }
.nav .item { color: red; font-size: 12px; }
@media (max-width: 800px) {
  .nav { color: #333; }
  .nav:hover { color: #666; }
}
```

If use [Babel](http://babeljs.io/docs/usage/cli/), see below (with [babel-plugin-transform-cssobj](https://github.com/cssobj/babel-plugin-transform-cssobj)):

```javascript
const result = CSSOBJ`
---
# use YAML as config
plugins:
  - default-unit: px
---

// SCSS style
.nav {
  color: blue;

  // nested selector, function as value
  .item { color: red; font-size: ${v => v.raw ? v.raw + 1 : 12} }

  // @media rule
  @media (max-width: 800px) {
    color: #333;
    &:hover {
      color: #666;
    }
  }

}
`

// above will create <style>, insert CSS rules, random namespace: _1jkhrb92_

result.mapClass(<ul class='nav'><li class='item'>ITEM</li></ul>)
// <ul class="nav_1jkhrb92_"><li class="item_1jkhrb92_"></li></ul>
```

If **NOT use Babel**, check the the render result:

``` Javascript
import cssobj from "cssobj";
import cssobj_plugin_default_unit from "cssobj-plugin-default-unit";
const result = cssobj({
  '.nav': {
    color: 'blue',
    '.item': {
      color: 'red',
      fontSize: v => v.raw ? v.raw + 1 : 12
    },
    '@media (max-width: 800px)': {
      color: '#333',
      '&:hover': {
        color: '#666'
      }
    }
  }
}, {
  plugins: [cssobj_plugin_default_unit('px')]
});

localClassName = result.mapClass('nav')
// nav_1jkhrb92_
```

First time render, the `font-size` currently is `12px`, then

``` javascript
result.update()
// font-size  ->  13px

result.update()
// font-size  ->  14px
```

**Control stylesheet from your source object**:

```javascript
// result.obj === source object in above
result.obj['.nav'].color = 'orange'

result.update()
// color      ->  'orange'
// font-size  ->   15px
```

Above, **only** `color` and `font-size` properties updated, other rules and props will **keep untouched**

That's it, see more [Usage & Example](https://github.com/cssobj/cssobj/blob/master/docs/usage-example.md)

## Install:

**npm** (CJS & ES)

``` bash
npm install cssobj  # the lib

# When you use Babel
npm install babel-plugin-transform-cssobj

# When **NOT** use Babel, install the convert tool
npm install -g cssobj-converter
```

**use in browser** (IIFE)

``` html
<script src="https://unpkg.com/cssobj"></script>
```

## Work Flow ( How the [babel-plugin-transform-cssobj][babel] does, you can do it manually )

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
const obj = require('./index.css')

// create <style> tag in <head>, with rules in obj.
// `local: true` will put class names into local space
const result = cssobj(obj, {local: true})

result.mapClass(<JSX>)  // map the whole JSX, with Babel
result.mapClass('classA')  // get the map of 'classA', without Babel

// later
// update some rule
obj['.nav'].color = 'red'
obj['.nav'].fontSize = function(v){ return parseInt(v.cooked) + 1 }  // increase font-size by 1
result.update()

```

Let's quickly learn the API:

**only one** top level method: `cssobj( obj, config )`, all other things using `result.someMethods`, that's all, really.

#### [Documented API](https://github.com/cssobj/cssobj/blob/master/docs/api.md)


#### More to read:

  - **!important** [CSSOBJ Format](https://github.com/cssobj/cssobj/wiki/Input-Object-Format)

  - [Understand Localization](https://github.com/cssobj/cssobj/wiki/Understand-Localization)

  - [Working with Babel/JSX](https://github.com/cssobj/cssobj/wiki/Working-with-Babel-JSX)

  - [Application Structure](https://github.com/cssobj/cssobj/wiki/Application-Module-Structure)

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

  - [babel-plugin-transform-cssobj][babel] Work with React, Vue etc. that can use babel+jsx

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

[babel]: https://github.com/cssobj/babel-plugin-transform-cssobj
