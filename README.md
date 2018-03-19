<img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">

# CSSOBJ [![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj)

Runtime CSS manager, Turn CSS into dynamic JS module, Stylesheet [CRUD][] (Create, Read, Update, Delete) in CSSOM, Solve common problems of CSS-in-JS.

 - ~4K min.gz, simple API
 - Nested rules, support any CSS selector/value
 - Minimal work to migrate
 - [Work with DOM Frameworks](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib)
 - [CSS Rules CRUD][CRUD]
 - [Put class names into local space **No Conflict**](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Use JS function as CSS value](https://github.com/cssobj/cssobj/wiki/Function-as-CSS-Value)
 - [Conditional Apply CSS](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [Server Rendering][server]

[Usage](https://github.com/cssobj/cssobj#usage) - [Wiki](https://github.com/cssobj/cssobj/wiki) - [API](https://github.com/cssobj/cssobj/blob/master/docs/api.md) - [Demo](https://cssobj.github.io/cssobj-demo/) - [React](https://github.com/cssobj/cssobj#react) - [Babel](https://github.com/cssobj/cssobj#work-flow-with-babel-see-also-without-babel-version)

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)
[![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj)
[![Coverage Status](https://coveralls.io/repos/github/cssobj/cssobj-core/badge.svg?branch=master)](https://coveralls.io/github/cssobj/cssobj-core?branch=master)
[![dependencies Status](https://david-dm.org/cssobj/cssobj/status.svg)](https://david-dm.org/cssobj/cssobj)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


## Install:

#### npm

``` bash
npm install cssobj  # the lib

# When use Babel
npm install babel-plugin-transform-cssobj

# When **NOT** use Babel, install the converter
npm install -g cssobj-converter
```

#### browser

``` html
<script src="https://unpkg.com/cssobj"></script>
```

## Usage

First see this [SIMPLE DEMO](http://jsbin.com/cibetuc/edit?html,js,output)

In the example, `cssobj` will create `<style>` tag in HEAD, render CSS rules inside

```javascript
import cssobj from 'cssobj'

const obj = {
  div: {
    backgroundColor: 'yellow',
    color: 'red',
    // simulate 50vh in CSS3
    height: () => window.innerHeight/2 + 'px'
  }
}
const result = cssobj(obj)

// dynamic update height when resize
window.onresize = () => result.update()
```

The rendered CSS (`height` is **dynamically** set to 50% of window height)

``` css
div { background-color: yellow; color: red; height: 600px; }
```

If you read the code, you've learned the API already:

**Only One** top level method: `cssobj( obj, [config] )`, all other things using `result.someMethods`, that's all, really.

## Stylesheet CRUD

The power of cssobj is CSS CRUD (Create, Read, Update, Delete), **dynamically change above CSS**, see below:

### 1. Update property values

You want to change color to `'blue'`

```javascript

// using static value:
obj.div.color = 'blue'
result.update()  // color is now 'blue'


// using function as value:
obj.div.color = function(v){
  return randomColor()
}
result.update()  // color is now random

```

### 2. Delete/Remove properties

You want to remove `backgroundColor`

It's just work as you expected:

```javascript

delete obj.div.backgroundColor
result.update()

```

### 3. Create/Add new properties

You want to add `'float'` and `'clear'`

It's just work as you expected:

```javascript
obj.div.float = 'left'
obj.div.clear = 'both'
result.update()
```

### 4. Create/Add new rules

You want to add `':after'` rule, and `div span` rule

```javascript
obj.div['&:after'] = { fontSize:'10px', content:'"---"' }
obj.div.span = { fontSize: '18px' }
result.update()
```

### 5. Update/Replace rules

You want to replace the whole rule

```javascript
obj.div.span = { color: 'green', fontSize: '20px' }
result.update()
```

**All the above can use `function` instead**

```javascript
obj.div.span = function() {
  return { color: randomColor(), fontSize: currentSize + 'px' }
}
result.update()
```

### 6. Delete/Remove rules

You want to remove `div span` rule

```javascript
delete obj.div.span
result.update()
```

### 7. Read a rule

Although `cssobj` can manage everything, you read the rule in stylesheet manually

```javascript
const rule = result.root.children.div.omRule[0]
// => CSSStyleRule
rule.color = 'red'
```

### 8. Delete/Destroy cssobj

Currently, `cssobj` don't provide `result.destroy()` or similar method, you should manually destroy things:

```javascript
// remove <style> tag
result.cssdom.parentNode.removeChild(el)
// GC result
result = null
```

Think of this: one `cssobj` instance === A `<style>` tag with rules <kbd>+</kbd> `A manager from JS`

## At-Rules

All `@-rules` work as expected, and `@media` can be nested at any level:

```javascript
cssobj({
  '.nav':{
    width: '1024px',
    '@media print': {
      display: 'none'
    }
  }
})
```
Above will hide `.nav` when print.

You can **emit** any `@media` rule by `cssom.media` option:

```javascript
const result = cssobj({
  '.nav':{
    width: '1024px',
    '@media print': {
      color: 'red'
    }
  }
}, { cssom: { media:'' } })

result.config.cssom.media = 'print'
result.update()

```

Above will switch to `print` view, with below CSS:

```css
nav {width: 1024px;}
nav {color: red;}
```

Then switch back:

```js
result.config.cssom.media = ''
result.update()
```


``` javascript
cssobj({
  '@keyframes changeColor': {
    '0%': { backgroundColor: 'green' },
    '100%': { backgroundColor: 'yellow' }
  },
  '.nav': {
    backgroundColor: 'red',
    animation: '5s infinite changeColor'
  }
})
```

Notice above `@keyframes`, it **have to be in top level** of your source object, aka cannot be nested into `.nav`,
that is different from `@media` rule, which allow nested at any level, or nested into another `@media`:

``` javascript
cssobj({
  h3:{
    color: 'blue',
    '@media (min-width: 400px)': {
      color: 'red',
      '@media (max-width: 500px)': {
          color: 'green'
      }
    },
    '@media (min-width: 500px)': {
      color: 'purple'
    }
  }
})
```

Above, what's the color will be? You can take a try and see what's the final CSS will be.

There's a hidden [JS Bin](https://jsbin.com/lavatit/edit?html,js,output)...

## Localize class names

Passing `local: true` as option, cssobj will add a random `name space` into all **class names**, this is called `localize`:

``` javascript
const result = cssobj(
  {
    '.nav': {color: 'red'}
  },
  { local: true }
)
```

Rendered CSS:

``` css
.nav_1lwyllh4_ {color: red;}
```

You can get this `name space` using `result.space`, or using below methods:

``` javascript
// As HTML class attribute
result.mapClass('nav active')  // [string] 'nav_1lwyllh4_ active_1lwyllh4_'

// As CSS selector
result.mapSel('.nav li.item')  // [string] '.nav_1lwyllh4_ li.item_1lwyllh4_'
```

## React

You can use [react-cssobj](https://github.com/futurist/react-cssobj) with React

## Work Flow with Babel, See also [Without Babel Version](https://github.com/cssobj/cssobj#work-flow-without-babel)

If use [Babel](http://babeljs.io/docs/usage/cli/), recommended the [babel-plugin-transform-cssobj](https://github.com/cssobj/babel-plugin-transform-cssobj)

```javascript
// create <style> in <head>, insert CSS rules, random namespace: _1jkhrb92_

// The babel-plugin only transform: CSSOBJ `text`

const result = CSSOBJ `
---
# cssobj config
local: true
plugins:
  - default-unit: px
---
// SCSS style (nested)
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
const html = result.mapClass(<ul class='nav'><li class='item active'>ITEM</li></ul>)
// <ul class="nav_1jkhrb92_"><li class="item_1jkhrb92_ active_1jkhrb92_"></li></ul>
```

Rendered result as below:

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
  local: true,
  plugins: [cssobj_plugin_default_unit('px')]
});

const html = <ul class={result.mapClass('nav')}><li class={result.mapClass('item active')}></li></ul>
```

For this first time render,
all class names add a random suffix `_1jkhrb92_`,
the `font-size` is `12px`,
the `<style>` tag which `cssobj` created now contains:

``` css
.nav_1jkhrb92_ { color: blue; height: 100px; }
.nav_1jkhrb92_ .item_1jkhrb92_ { color: red; font-size: 12px; }
@media (max-width: 800px) {
  .nav_1jkhrb92_ { color: rgb(51, 51, 51); }
  .nav_1jkhrb92_:active { color: rgb(102, 102, 102); }
}
```

#### Update CSS Value

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

Above, only `font-size` changed, all other things **keep untouched**

#### CRUD (Create, Read, Update, Delete) stylesheet from JS

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

Above, **only** diffed part updated, other rules and props will **keep untouched**

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

#### Diff with NEW JS Object

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

## Work Flow (Without Babel)

First install [cssobj-converter](https://github.com/cssobj/cssobj-converter)

``` javascript
npm install -g cssobj-converter
```

- **Step 1**

Write your CSS as normal (e.g. *index.css*)

``` css
// file: index.css
.nav { color: blue; font-size: 12px; }
```

- **Step 2**

Turn it into JS module, from `cssobj-converter` CLI

``` bash
# in command line, run cssobj-converter
cssobj index.css -o index.css.js
```

The result

``` javascript
// file: index.css.js
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

#### [Documented API](https://github.com/cssobj/cssobj/blob/master/docs/api.md)


#### More to read:

  - **!important** [CSSOBJ Format](https://github.com/cssobj/cssobj/wiki/Input-Object-Format)

  - [Understand Localization](https://github.com/cssobj/cssobj/wiki/Understand-Localization)

  - [Working with Babel/JSX](https://github.com/cssobj/cssobj/wiki/Working-with-Babel-JSX)

  - [Application Structure](https://github.com/cssobj/cssobj/wiki/Application-Module-Structure)

  - [Merge multiple objects](https://github.com/cssobj/cssobj/wiki/Merge-Multiple-Objects)

  - [Working with popular libs](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib)

  - [Working with Stream](https://github.com/cssobj/cssobj/wiki/Working-With-Stream)

  - [Server side rendering][server]

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

  About writing a plugin, See: [plugin-guide](https://github.com/cssobj/cssobj/wiki/Plugin-Guide)

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
[server]: https://github.com/cssobj/cssobj/wiki/Server-Side-Rendering
[CRUD]: https://github.com/cssobj/cssobj/wiki/Dynamically-update-css
[CSSOM]: http://dev.w3.org/csswg/cssom/
