# Understand Localization

## cssobj only localize class names

```Javascript
result = cssobj({
  'div#nav.active[title="abc"]': { width: '10px' }
}, {local: true})

```

Rendered css:

```css
div#nav.active_i3e8bsj1_[title="abc"]': { width: 10px; }
```

Here only the class name `.active` will be localized, that's the nature of CSS (ID is unique, tag name is designated)

So if you use cssobj, use **class** to localize your name, into seperate **space**

## How space defined

The default localization way is to add a random string **after** the class name, this random string called **space**

In above example, `space == "_i3e8bsj1_"`, you can get it using `result.space`

The algorithm of the random string roughly is: `String from Math.random` (the `i3e8bsj`) <kbd>+</kbd> `global counter` (the `1`)

Each call of cssobj, the global counter increased, so there's almost no chance to have 2 identical space in a page

You can **define** your own **random** method using `local: { random: your_func }` option, example: `random: ()=>+new Date`

You can **define** your **space** using `local: { space: '_your_space_' }` option, it's recommanded to add `_` at both end

That way you can manually get a space, more predicable

Assume 2 designer on their own part of work, they can define their own space:

- **Designer 1**: `cssobj(style, {local: {space: '_james_'}})`

- **Designer 2**: `cssobj(style, {local: {space: '_merry_'}})`

They can freely style their page using class, no conflict

## Control More Details

You can control which class map to which name, using `local: { localNames: { nav: 'classA', item: 'classB' } }`

When cssobj process class names, it first check the `localNames` object, if match a key, will use that value as localized result

So object `{ '.nav': {}, '.active': {}, '.item': {} }` will be localized as:

```css
.classA {}
.active_i3e8bsj_ {}
.classB {}
```

Your team can share a common table to define some class as global map, others will become local map

## Get The Localized Names

It's not right to simply using **classname** <kbd>+</kbd> **space** to get the finally class name, since the existing of `localNames`

But if you don't use `localNames`, above way is roughly right

There're **2** way get your finally names: `result.mapClass` and `result.mapSel` function

### `result.mapClass` map to **classList**

  What is `classList`? Think `<div className='a b c'`, the `a b c` is a `classList`: **no dot** in front, **space seperated**

  Use `result.mapClass` get `classList` in your MVC application

  ```Javascript
  const html = <div className={result.mapClass('classA classB classC')}></div>
  ```

  The conterpart HTML

  ```html
  <div class="classA_i3e8bsj_ classB_i3e8bsj_ classC_i3e8bsj_"></div>
  ```

  You can add escape sign: **!** in front of a class, to **escape** the class from transform, say, using **global** name space

  Code `result.mapClass('classA !classB classC')`, the result:

  ```html
  <div class="classA_i3e8bsj_ classB classC_i3e8bsj_"></div>
  ```

  **Notice**: When add **!**, you should also add that in your source object

  `obj = { '.classA':{}, '.!classB':{}, '.classC':{} }`

### `result.mapSel` map to **selector**

  What is `selector`? `$` of **jQuery** use `selector` to work, most of modern MVC lib use something like [hyperscript](https://github.com/dominictarr/hyperscript) to represent markup, the syntax is a **subset** of `selector`

- **jQuery**

  ```
  $('ul.nav li').hide()

  // get localized selector
  $( result.mapSel('ul.nav li') ).hide()
  // => $('ul.nav_i3e8bsj_ li').hide()
  ```

- **hyperscript**

  ```Javascript
  h('div.menu', h('ul.nav', ...))

  // get localized selector
  h( result.mapSel('div.menu') , h( result.mapSel('ul.!nav') , ...))
  // => h('div.menu_i3e8bsj_', h('ul.nav', ...))
  ```

  Also, you can add the escape sign: **!** in front of class to force it use **global space**, cssobj won't touch the name

  **Notice**: When add **!** in `mapSel`, you should also add that in your source object

  `{'.menu': { '.!nav': { color:'blue' } }}`


### Simplify the map

  Check below **helper lib** to simplify the code of `mapClass` and `mapSel`

  - **Babel JSX** [babel-plugin-transform-cssobj](https://github.com/cssobj/babel-plugin-transform-cssobj)

  - **Mithril** [cssobj-mithril](https://github.com/cssobj/cssobj-mithril)

  - **More** is welcome



