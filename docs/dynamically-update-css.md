# Dynamically update css, CRUD of stylesheet

Think below code at head of your page:

```javascript
var obj = {
  div: {
    $id: 'div',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'red'
  }
}
var result = cssobj(obj)

// you want change css later... ...
```


For CRUD (Create, Read, Update, Delete), **dynamically change css**, see below:

## 1. Update property values

You want to change color to `'blue'`, code as below:

```javascript

// using static value:
obj.div.color = 'blue'  // same as obj.div.color = ['blue']
result.update()  // color is now 'blue'


// using function as value:
obj.div.color = function(v){
  return v.result.data.color
}
result.update({color:'blue'})  // color is now 'blue'

```

## 2. Remove properties

You want to remove `'fontSize'` and `'lineHeight'`, code as below:

It's just work as you expected:

```javascript

delete obj.div.fontSize
delete obj.div.lineHeight
result.update()

```

## 3. Add new properties

You want to add `'float'` and `'clear'`.

It's just work as you expected:

```javascript
obj.div.float = 'left'
obj.div.clear = 'both'
result.update()
```

## 4. Add new rules

You want to add `':after'` rule, and `div span` rule

```javascript
obj.div['&:after'] = { fontSize:'10px', content:'"---"' }
obj.div.span = { fontSize: '18px' }
result.update()
```

## 5. Replace rules

You want to replace the whole rule

```javascript
obj.div.span = { color: 'green', fontSize: '20px' }
result.update()
```

## 6. Remove rules

You want to remove `div span` rule

```javascript
delete obj.div.span
result.update()
```

## 7. Read a rule

Although `cssobj` can manage everything, you read the rule in stylesheet

```javascript
result.ref.div.omRule
// => [CSSStyleRule]
```

# All the above can use `function` instead:

```javascript
obj.div.span = function() {
  return { color: randomColor(), fontSize: currentSize + 'px' }
}
result.update()
```

**the options for prop's function**

If you set function for prop's value:

```javascript
obj.div.span.fontSize = function(v) {
  return 1 + v.raw
}

```

`v` have below properties:

 - `v.raw` : Source JS value for this property, that is: **before** any plugin, and validation check
 - `v.cooked` : Last valid css value for this property, that is: returns like `null` will ignored by **cssobj**
 - `v.node` : The current **virtual css** node generated from `cssobj-core`, commonly, you can check `node.prop` object for current rule's value
 - `v.result` : The **cssobj** result object
