# CSSOBJ Input Object Format

The object format for **cssobj** is as below:

### 1. It's normal JS Object (`Array|Object`)

### 2. Object **key** as **CSS selector** / **CSS property** / **directive**

 1. If key start with **$**, it's cssobj **directive**, never rendered
 2. If value is **object like** (`Array|Object`), key will act as **CSS selector**
 3. If value is **non-object** (`String|Number|Function`, other types ignored), key will act as **CSS property**
 4. **@at-rules** cannot be nested (have to be **TOP LEVEL**), except for **@at-media rule**

### 3. **CSS selector** rule

 - 1 Normal object **key** will be combined with **parent key** with 1 space.

`{ ul: { 'li:active': {} } }` => `'ul li:active'`

 - 2 Any `'&'` will be replaced by parent selector

`{li: { '&[title="x,&y"]': {} } }` => `'li li[title="x,&y"]'`

 - 3 `','` will be combined with **parent key** seperatedly.

`{li: { 'p,span': {} } }` => `'li p, li span'`

 - 4 If the key start with `@media`, then:

#### all `@media` will be escaped as **top level** rule

```javascript
{
  '.widget': {
    padding: '10px',
    '@media screen and (min-width: 600px)': {
      padding: '20px'
    }
  }
}
```

will be:

```css
.widget { padding: 10px; }
@media screen and (min-width: 600px) {
  .widget { padding: 20px; }
}
```

#### nested `@media` will have parent group condition combined:

```javascript
{
  '@media (min-width: 500px)': {
    '.widget': {padding: '10px'},
    '@media (max-width: 600px), (min-height: 200px)': {
      '.widget': {padding: '20px'}
    }
  }
}
```

will be:

```css
@media (min-width: 500px){
  .widget { padding: 10px; }
}
@media (min-width: 500px) and (max-width: 600px), (min-width:500px) and (min-height: 200px) {
  .widget { padding: 20px; }
}
```

### 4. CSS property and value rule

  - 1 If value is not **object like** (`Array|Object`), then the **key** will act as **CSS property**

  - 2 The property key is **camelCased**

`{p: { fontSize : '16px' } }` => `p {font-size: 16px}`

This keep cssobj work as tested, think below

```javascript
// avoid using below:
obj.p['font-size'] = '18px'

// perfered way:
obj.p.fontSize = '18px'

// float is still float:
obj.p.float = 'left'
```

See [List of CSS Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference), except for, using `float` instead of `cssFloat`.

  - 3 Valid literal value type is `String`, `Number`, and will rendered **AS IS**. Also accept [Function Value](#s4-5)

  - 4 If value type is `Array`, and it's first value is `String|Number`, then [the value will expanded](properties-with-multiple-values.md)

```javascript
{
  '.wrapper': {
    display: ['-webkit-box', '-moz-box', '-ms-flexbox', 'flex']
  }
}
```

will be

```css
.wrapper {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}
```

  - 5 <a name="s4-5"></a>If value type is `Function`, then the function will be evaluated with signature:

  `function(v: object{raw,cooked,node,result} ){ } -> string|number|object`

  Exmaple:

  `{p: { fontSize : function(v){return '16px'} } }` => `p {font-size: 16}`

  More info, plesae refer to [Function as CSS Value](https://github.com/cssobj/cssobj/wiki/Function-as-CSS-Value)

If the function return an **Object**, it will be merged into current css props.

`{p: { fontSize : function(v){return {color: 'red', border: v => v.prev + 1} } } }` => `p { color: red; border: v=>v.prev+1; }`

See the related plugin: [cssobj-plugin-replace](https://github.com/cssobj/cssobj-plugin-replace)

### 5. CSSOBJ Directives

A **directive** start with <kbd>$</kbd> char, and **never be rendered**, native support below **directives**:

 - 1 `$id`: will populate the **cssobj v-node** as reference to `result.ref` object.

```javascript
var obj={p: {span: { $id:'abc'} }}
var result = cssobj(obj)
// result.ref.abc === v-node of span
// result.ref.abc.obj === { $id:'abc'}
```

 - 2 `$order`: non-zero value will change the object render order

```javascript
var obj={p: {
    em: { $order:2, color: function A(){} },
    span: { color: function B(){} }
  }}
var result = cssobj(obj)
// span node will be evaluated first, then em node; order is B=>A
```

 - 3 `$test`: A `boolean` value or `function` to determine whether the node will be rendered.

```javascript
var obj={p: {
    em: { $test: function (){ return false }, color: 'blue' },
    span: { color: 'red' }
  }}
var result = cssobj(obj)
```

will be

```css
p span { color: 'red' }
```

**p em** never render.

#### More directives can be extended with **plugin**

[cssobj-plugin-extend](https://github.com/cssobj/cssobj-plugin-extend)


