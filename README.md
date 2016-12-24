<img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">

# CSSOBJ [![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj)

CSS in JS solution, **name space** (local) your stylesheet, **change rules at runtime**, features:

 - **~4K min.gz**
 - **Support Any CSS Selector/Value**
 - [Can Write SCSS/LESS Directly](https://github.com/cssobj/babel-plugin-transform-cssobj)
 - [**CSS Rules** Create, Update](https://cssobj.github.io/cssobj-demo/#demo1)
 - [Put class names into local space **No Conflict**](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Nested Child Selector](https://cssobj.github.io/cssobj-demo/#demoprefixer)
 - [Conditional Apply CSS](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [Auto Vendor Prefixer](http://1111hui.com/github/css/cssobj-demo/#demoprefixer)
 - [Media Query hook for IE8](https://cssobj.github.io/cssobj-demo/#demomedia)

[Wiki](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib) - [API](https://github.com/cssobj/cssobj/blob/master/docs/api.md) - [Live Demo](https://cssobj.github.io/cssobj-demo/) - [Github Repo](https://github.com/cssobj/cssobj) - [Babel/JSX](https://github.com/cssobj/babel-plugin-transform-cssobj)

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)
[![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj)
[![Coverage Status](https://coveralls.io/repos/github/cssobj/cssobj-core/badge.svg?branch=master)](https://coveralls.io/github/cssobj/cssobj-core?branch=master)
[![dependencies Status](https://david-dm.org/cssobj/cssobj/status.svg)](https://david-dm.org/cssobj/cssobj)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[ie]: https://github.com/cssobj/cssobj/wiki/How-@media-work-in-IE8

## Highlight

Render CSS string from js, pack style sheet into js component, it's not hard today, [there are many](https://github.com/cssobj/cssobj/wiki/Compared-with-similar-libs)

The hard part is **dynamically update rules at runtime**, replace `<style>` tag with whole new string is **doing wrong**

`cssobj` use [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model), **diff object, udpate rule** at stylesheet **Property** level

In addition to many basic features of CSS-in-JS technology, cssobj is the **unique** lib that focus on:

 - **Stylesheet virtualization**

 - **Nested stylesheet optimization**, similar to [SCSS](http://sass-lang.com/)/[LESS](http://lesscss.org/) in browser, but tiny

 - [Dynamically change rules at run time](https://github.com/cssobj/cssobj/wiki/Dynamically-update-css)

 - [Use JS function as CSS value (Powerful!)](https://github.com/cssobj/cssobj/wiki/Function-as-CSS-Value)

 - [@media work under IE8][ie] (A bonus, add some IE8 bundle size (0.3K), no perf decreased)

Assume we have below CSS, the `font-size` need to be **increased by 1** each time when user clicked

``` css
.nav { color: blue; }
.nav .item { color: red; font-size: 12px; /* font-size need to be changed by user */ }
@media (max-width: 800px) {
  .nav { color: #333; }
  .nav:active { color: #666; }
}
```

If use [Babel](http://babeljs.io/docs/usage/cli/), see below (with [babel-plugin-transform-cssobj](https://github.com/cssobj/babel-plugin-transform-cssobj)):

```javascript
// create <style> in <head>, insert CSS rules, random namespace: _1jkhrb92_

// The babel-plugin only transform: CSSOBJ `text`

const result = CSSOBJ `
---
# cssobj config
plugins:
  - default-unit: px
---
// stylesheet, SCSS style (nested)
.nav {
  color: blue;
  height: 100;

  // font-size is a function
  .item { color: red; font-size: ${v => v.raw ? v.raw + 1 : 12} }

  // nested @media
  @media (max-width: 800px) {
    color: #333;
    // & = parent selector = .nav
    &:active {
      color: #666;
    }
  }

}
`
result.mapClass(<ul class='nav'><li class='item'>ITEM</li></ul>)
// <ul class="nav_1jkhrb92_"><li class="item_1jkhrb92_"></li></ul>
```

If **NOT Use Babel**, check below rendered result:

``` Javascript
import cssobj from "cssobj";
import cssobj_plugin_default_unit from "cssobj-plugin-default-unit";
const result = cssobj({
  '.nav': {
    color: 'blue',
    height: 100,
    '.item': {
      color: 'red',
      fontSize: v => v.raw ? v.raw + 1 : 12
    },
    '@media (max-width: 800px)': {
      color: '#333',
      '&:active': {
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

For this first time render,
all class names added a random suffix `_1jkhrb92_`,
the `font-size` is `12px`,
and `@media` just work under IE8,
the `<style>` tag which `cssobj` created now contains:

``` css
.nav_1jkhrb92_ { color: blue; height: 100px; }
.nav_1jkhrb92_ .item_1jkhrb92_ { color: red; font-size: 12px; }
@media (max-width: 800px) {
  .nav_1jkhrb92_ { color: rgb(51, 51, 51); }
  .nav_1jkhrb92_:active { color: rgb(102, 102, 102); }
}
```

**Update CSS Value**

Since we already have a function as the value:

  `fontSize: v => v.raw ? v.raw + 1 : 12`

 - the value (===`v.raw`) initialised with `12` (`default-unit` plugin will add `px` when rendering, that is `v.cooked` === `12px`)

 - each call of the function will increase `font-size` by 1

So, just need call `result.update`, the function invoked, stylesheet updated, automatically:

``` javascript
result.update()
// font-size  ->  13px

result.update()
// font-size  ->  14px
```

Above, each `result.update` only change `font-size`, all other things **keep untouched**

**Change stylesheet from source JS Object**:

When the source JS Object (`first arg of cssobj()`) have no changes,
`result.update` only invoke the value function (here, the above `font-size` function),

Otherwise, it will look into the source JS Object, find which part have been changed (**diff**),
and update stylesheet accordingly. See below:

```javascript
// result.obj === reference of the source js object

// change a css property
result.obj['.nav'].color = 'orange'

// remove a css property
delete result.obj['.nav'].height

// add a new css property
result.obj['.nav'].width = 200

// add a new rule
result.obj['.nav'].a = { color: 'blue', '&:hover': {textDecoration: 'none'} }

// delete a rule
delete result.obj['.nav']['.item']

result.update()

// color      ->  'orange' (PROP CHANGED)
// height     ->   (PROP REMOVED)
// width      ->   200px (PROP ADDED)
// a, a:hover ->   (RULE ADDED)
// .item      ->   (RULE REMOVED)

```

Above, **only** diffed rules and prop updated, other rules and props will **keep untouched**

Now, the stylesheet becomes:

``` css
.nav_1jkhrb92_ { color: orange; width: 200px; }
@media (max-width: 800px) {
  .nav_1jkhrb92_ { color: #333; }
  .nav_1jkhrb92_:active { color: #666; }
}
.nav_1jkhrb92_ a { color: blue; }
.nav_1jkhrb92_ a:hover { text-decoration: none; }
```

**Diff with NEW JS Object**

``` javascript
const newObj = { '.nav': { width: 100, a: { color: 'blue' } } }
result.update(newObj)
// cssobj will DIFF with old obj, keep same part, change diffed part in stylesheet!
// .nav, .nav a   rules keeped
// width -> 100px, drop all other rules/props
```

Now, the stylesheet becomes:

``` css
/* below 2 rules keeped */
.nav_1jkhrb92_ { width: 100px; }
.nav_1jkhrb92_ a { color: blue; }

/* other rules gone */
```

That's it, see more [Usage & Example](https://github.com/cssobj/cssobj/blob/master/docs/usage-example.md)

## Install:

**npm** (CJS & ES)

``` bash
npm install cssobj  # the lib

# When use Babel
npm install babel-plugin-transform-cssobj

# When **NOT** use Babel, install the converter
npm install -g cssobj-converter
```

**use in browser** (IIFE)

``` html
<script src="https://unpkg.com/cssobj"></script>
```

## Work Flow

It's how the [babel-plugin-transform-cssobj][babel] does (roughly), but below steps have more control

- **Step 1**

Write your CSS as normal (e.g. *index.css*), e.g.:

``` css
.nav { color: blue; font-size: 12px; }
```

- **Step 2**

Convert CSS file *index.css* into *index.css.js* as JS module, using [cssobj-converter](https://github.com/cssobj/cssobj-converter):

``` bash
# in command line
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

result.mapClass(<JSX>)  // with Babel
result.mapClass('classA')  // without Babel

// update some rule
obj['.nav'].color = 'red'
obj['.nav'].fontSize = v => parseInt(v.cooked) + 1  // increase font-size by 1
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
