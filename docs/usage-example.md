# Usage & Example

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-generate-toc again -->
**Table of Contents**

- [- local class names](#--local-class-names)
- [- Dynamicly update you css rule](#--dynamicly-update-you-css-rule)
- [- Dynamic caculation](#--dynamic-caculation)
- [- @media rule work in old Browsers](#--media-rule-work-in-old-browsers)
- [- Auto vendor prefixer](#--auto-vendor-prefixer)
- [- Iframe support](#--iframe-support)

<!-- markdown-toc end -->

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
var result = cssobj(obj, {local:true})  // { local: {space:'-james-'} }
```

This will generate [CSSOM](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model) in your `<head>`, with below css:

``` css
body {
  color: red;
}
.item_1jkhrb92_ {
  font-size: 12px;
}
.item_1jkhrb92_ span {
  color: blue;
}
```

Class names will add a random string, you can get class name using below:

``` javascript
/* want localized CSS Selector, use mapSel */
result.mapSel('ul#nav.list')   // === "ul#nav.list_1jkhrb92_"

/* want localized space separated class names (W/O DOT), use mapClass */
result.mapClass('item active')   // === "item_1jkhrb92_ active_1jkhrb92_"
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

### - Dynamic caculation

```js
obj.div.width = function(){ return window.innerWidth / 3 + 'px' }
obj.div.height = function(){ return this.width }
result.update()
```

Then all the `div` will have same width & height, as 1/3 of window width, magicly!


### - @media rule work in old Browsers

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

Then `div` will have color as **red**, **green** and **blue** accordingly (tested Modern & **IE8**)

**IE8** don't support `@media`, cssobj will listen to `window.resize` event, to **dynamically enable rule or disable rule** in `@media scope`

[Demo](https://cssobj.github.io/cssobj-demo/play/) for **@media (min-width), (max-width)**

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

### - Iframe support

Use with `<iframe>` is easy:

```js
iframe.onload = function(e){
  cssobj(obj, {cssom: { frame: iframe }})
}
```

