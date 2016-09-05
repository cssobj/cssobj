# CSSOBJ Input Object Format

The object format for **cssobj** is as below:

## 1. It's normal JS Object (`Array|Object`)

## 2. Object **key** as **CSS selector** / **CSS property** / **directive**

  - If key start with **$**, it's cssobj **directive**, never rendered
  - If value is **object like** (`Array|Object`), key will act as **CSS selector**
  - If value is **non-object** (`String|Number|Function`, other types ignored), key will act as **CSS property**

## 3. **CSS selector** rule

  - Normal object **key** will be combined with **parent key** with 1 space.

`{ ul: { 'li:active': {} } }` => `'ul li:active'`

  - Any `'&'` will be replaced by parent selector; <kbd>\\&</kbd> will be escaped as `'&'`.

`{li: { '&[title="x\\&y"]': {} } }` => `'li li[title="x&y"]'`

  - `','` will be combined with **parent key** seperatedly.

`{li: { 'p,span': {} } }` => `'li p, li span'`

  - If the key start with `@media`, then:

### all `@media` will be escaped as **top level** rule

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

### nested `@media` will have parent group condition combined:

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

## 4. CSS property and value rule

  - If value is not **object like** (`Array|Object`), then the **key** will act as **CSS property**

  - The property key is **camelCased**

`{p: { fontSize : '16px' } }` => `p {font-size: 16px}`

  - Valid value type is `String` and `Number`, and will rendered **AS IS**

  - If value type is `Array`, and it's first value is `String|Number`, then [the value will expanded](properties-with-multiple-values.md)

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

  - If value type is `Function`, then the function will be evaluated with signature: `function(prev, node, result){}`

`{p: { fontSize : function(prev, node, result){return '16px'} } }` => `p {font-size: 16px}`

## 5. CSSOBJ Directives

A **directive** start with <kbd>$</kbd> char, and **never be rendered**, native support below **directives**:

  - `$id`: will populate the **cssobj v-node** as reference to `result.ref` object.

```javascript
var obj={p: {span: { $id:'abc'} }}
var result = cssobj(obj)
// result.ref.abc === v-node of span
// result.ref.abc.obj === { $id:'abc'}
```

  - `$order`: non-zero value will change the object render order

```javascript
var obj={p: {
    em: { $order:2, color: function A(){} },
    span: { color: function B(){} }
  }}
var result = cssobj(obj)
// span node will be evaluated first, then em node; order is B=>A
```

  - `$test`: A `boolean` value or `function` to determine whether the node will be rendered.

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

### more directives can be extended with **plugin**
