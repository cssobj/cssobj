# Working with babel/jsx

When you rely on `babel` and `jsx`, you can easily transform your existing code into cssobj localized one.

With the plugin [babel-plugin-transform-cssobj-jsx](https://github.com/cssobj/babel-plugin-transform-cssobj-jsx)

``` javascript
const style = cssobj(obj)

const html = (
    <div className={'nav', style}>
    <p className={'!news item active', style}> </p></div>
)
```

The plugin will transform into below:

``` javascript
const html = (
    <div className={result.mapClass('nav')}>
    <p className={result.mapClass('!news item active')}> </p></div>
)
```

Just a sugar, but more handy.

