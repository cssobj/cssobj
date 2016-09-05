# Property with multiple values

When using `css in js`, the common way is to use JS object, but for **vendor prefix**, like below:

```css
.wrapper {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}
```

How to express in JS object?

**cssobj** using array of values to express this:

```javascript
var obj = {
  '.wrapper': {
    display: ['-webkit-box', '-moz-box', '-ms-flexbox', 'flex']
  }
}
cssobj(obj)
```

That is, any value in **cssobj** can put in array, below have same result:

```javascript
obj1 = { p: {color: 'red' } }
obj2 = { p: {color: ['red'] } }
```

But you can push new values into second line:
```javascript
obj2.p.color.push('blue')
```

The result css:
```css
p {
  color: red;
  color: blue;
}
```

Obviously, the last value will win in CSS.


