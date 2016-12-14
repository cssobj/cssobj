<img align="right" src="data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width="0" height="150" border="0"><img align="right" title="cssobj logo" alt="cssobj logo" align="bottom" src="https://avatars0.githubusercontent.com/u/20465580?v=3&s=132" border="30" hspace="0" vspace="20">
# CSSOBJ

[![Build Status](https://travis-ci.org/cssobj/cssobj.svg?branch=master)](https://travis-ci.org/cssobj/cssobj)
[![Join the chat at https://gitter.im/css-in-js/cssobj](https://badges.gitter.im/css-in-js/cssobj.svg)](https://gitter.im/css-in-js/cssobj?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm](https://img.shields.io/npm/v/cssobj.svg "Version")](https://www.npmjs.com/package/cssobj)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

CSS in JS solution, create [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) and CSS rules from js, features:

 - **~4K min.gz**
 - **CSS Rules** create and **diff update**
 - [Safety of Unicode/Comma/Ampersand](https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS)
 - [Conditional apply CSS (good for SPA)](https://cssobj.github.io/cssobj-demo/test/test.html)
 - [CSS modules with local class](https://cssobj.github.io/cssobj-demo/#demo4)
 - [Auto vendor prefixer](http://1111hui.com/github/css/cssobj-demo/#demoprefixer)
 - [Media query hook](https://cssobj.github.io/cssobj-demo/#demomedia)
 - [Dynamically change CSS](https://cssobj.github.io/cssobj-demo/#demo1)
 - [Server Side Rendering](https://github.com/cssobj/cssobj/wiki/Server-Side-Rendering)

[Wiki](https://github.com/cssobj/cssobj/wiki/Work-with-popular-JS-Lib) - [API](https://github.com/cssobj/cssobj/blob/master/docs/api.md) - [Live Demo](https://cssobj.github.io/cssobj-demo/) - [Github Repo](https://github.com/cssobj/cssobj) - [LESS in JS](https://github.com/futurist/cssobj-less)

### Features Compared with similar libs

*all the below libs will create CSS Rules from JS object*

| Lib                   | [cssobj][] | [glamor][] | [fela][]        | [styletron][] | [cxs][]    | [aphrodite][] |
|-----------------------|------------|------------|-----------------|---------------|------------|---------------|
| Version               | 1.0.0      | 2.20.12    | 4.1.0           | 2.2.0         | 3.0.0      | 1.1.0         |
| Size(min.gz)          | 4K         | 8K         | N/A             | N/A           | 6K         | 6K            |
| [Unicode Safe][uni]   | **YES**    | *NO*       | **YES**         | *NO*          | **YES**    | *NO*          |
| [Comma Safe][comma]   | **YES**    | *NO*       | NotSupport      | NotSupport    | NotSupport | NotSupport    |
| [Ampersand Safe][amp] | **YES**    | *NO*       | NotSupport      | NotSupport    | *NO*       | NotSupport    |
| [Keep Class Names][k] | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | **YES**       |
| CSS Virtual Node      | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| Dynamic Update[Diff]  | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| Auto Prefixer[In-Core]| **YES**    | **YES**    | *NO*            | *NO*          | *NO*       | **YES**       |
| Function as CSS Value | **YES**    | *NO*       | *NO*            | *NO*          | *NO*       | *NO*          |
| Conditional Apply     | **YES**    | *NO*       | **YES**[Plugin] | *NO*          | *NO*       | **YES**       |
| Inject To DOM         | **Auto**   | **Auto**   | *Manually*      | *Manually*    | *Manually* | **Auto**      |
| Server Rendering      | **YES**    | **YES**    | **YES**         | **YES**       | **YES**    | **YES**       |

[cssobj]: https://github.com/cssobj/cssobj
[glamor]: https://github.com/threepointone/glamor
[fela]: https://github.com/rofrischmann/fela/
[styletron]: https://github.com/rtsao/styletron
[cxs]: https://github.com/jxnblk/cxs
[aphrodite]: https://github.com/Khan/aphrodite

[uni]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-avoid-using-unicode-unsafe-regexp
[comma]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-split--comma-right
[amp]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-replace--char-right
[k]: https://github.com/cssobj/cssobj/wiki/A-Better-CSS-in-JS#should-keep-original-class-names

## Why?

For a long time, changing CSS is via **DOM.style**, like below:

``` javascript
// vanilla
document.getElementById('domID').style.color = 'red'
document.getElementById('domID').style.fontSize = '14px'

// jquery
$('div').css({color:'red', fontSize:'14px'})  // all the DIVs!
```

It's straight forward, but have [performance issues](http://www.quirksmode.org/dom/classchange.html), cannot use `pseudo-selector`, etc.

[CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) is the base of browser, have good Javascript API, why not using it?

This lib convert JS Object into CSSOM Rules, And **diff udpate**, see below:

```javascript
import cssobj from 'cssobj'

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

That's it, see more [Usage & Example](https://github.com/cssobj/cssobj/blob/master/docs/usage-example.md)

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

## How it worked?

1. **cssobj** first parse js object into **Virtual CSSOM** middle format.

2. The internal [cssom](https://github.com/cssobj/cssobj-plugin-cssom) plugin will create stylesheet dom, and apply rules from middle format.

3. When the js object changed, **cssobj** will diff CSSOM rules (**add/delete/change**) accordingly. (see [demo](https://cssobj.github.io/cssobj-demo/#demo1))

## [check here for API docs](https://github.com/cssobj/cssobj/blob/master/docs/api.md)

## Tools

  Convert you existing style sheet into *cssobj*:

  - [CLI Converter](https://github.com/cssobj/cssobj-converter) **Recommended** CLI tools to convert CSS. Run `npm -g cssobj-converter`

  - [Online Converter](http://convertcssobj-futurist.rhcloud.com/) It's free node server, slow, and unstalbe, not recommended

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

  - [cssobj-helper-stylize](https://github.com/cssobj/cssobj-helper-stylize) Add css string into style dom

  - [cssobj-helper-showcss](https://github.com/cssobj/cssobj-helper-showcss) Display css string from style tag

  - [cssobj-mithril](https://github.com/cssobj/cssobj-mithril) Help cssobj to work with [mithril](https://github.com/lhorie/mithril.js)

## Demos

  - [cssobj-demo](https://github.com/cssobj/cssobj-demo)


## Test

Using [phantom](http://phantomjs.org/) 2.0 to test with CSSOM. Please see **test/** folder.

## Remark

cssobj is wrapper for [cssobj-core](https://github.com/cssobj/cssobj-core), [plugin-localize](https://github.com/cssobj/cssobj-plugin-localize) and [plugin-cssom](https://github.com/cssobj/cssobj-plugin-cssom).

## License

MIT

