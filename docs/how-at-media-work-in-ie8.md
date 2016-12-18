# How @media work in IE8

Making **@media** work under IE8 is a bonus of using cssobj, there's some other solution like [Respond.js](https://github.com/scottjehl/Respond)

`Respond.js` download the whole CSS file (have to be under HTTP) and parse the string using RegExp, hook `window.resize` event, extract `@media` condition, then insert the part of `@media` style sheet into a `<style>` tag

## The cssobj Way

`cssobj` first try to insert `@media` rule in style, when failed, indicate the browser don't support `@media` rule

`cssobj` then hook `window.resize` event, but we have js object already, so **no need to download**, just extract the `@media` condition, and **dynamically enable/disable** rules in **CSSOM**, according to window size. more efficient, and can work under local files

## Reference

 - cssobj 1.0 only support IE8

 - cssobj 0.7.3 also support IE<8

