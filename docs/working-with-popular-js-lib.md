# Work with popular JS Lib

**cssobj** is good for using with vanilla JS or any JS libs like **MVC frameworks**

 - [ReactJS](#reactjs)
 - [jQuery](#jquery)
 - [Mithril](#mithril)
 - [Vue](#vue)
 - [Angular 1](#angular-1)
 - [Angular 2](#angular-2)


Think below code at head of your page:

```javascript
var obj = {
  '.nav': {
    '.item': {
      color: 'blue',
      '&.active': {
        color: 'red'
      }
    }
  }
}

```

Just like your normally use with plain css, just beware of **local class names**

You may want to use with:

## ReactJS

You can use [react-cssobj](https://github.com/futurist/react-cssobj) with React

## jQuery

```javascript
// get result from cssobj
var result = cssobj(obj, {local: true})

// get local selector
$(result.mapSel('.nav .item')).append(...)

// get local class list
$('div').addClass(result.mapClass('!news item active'))
```


## Mithril

For mithril, please check out [cssobj-mithril](https://github.com/cssobj/cssobj-mithril), for zero effect to `mapClass`

Without above repo, you can just use mithril natively as below:

[fiddle demo](https://jsfiddle.net/futurist/ppof3fhv/) Please open console and see **local class names** work!

```javascript
var component = {
  controller: function () {
    var self = this
    this.result = cssobj(obj, {local:true})
    this.updateCSS = () => {
      obj['.nav'].fontSize = '34px'
      self.result.update()
    }
  },
  view: function (ctrl) {
    var result = ctrl.result
    return m (
      result.mapSel('ul.nav'),
      m (
        result.mapSel('li.item'),
        {
          class: result.mapClass('!news item active'),
          onclick: ctrl.updateCSS
        },
        'cssobj is awesome!'
      )
    )
  }
}

m.mount(document.getElementById('container'), component)

```

## Vue

**Notice**, if you use Vue2.0, should check [babel-plugin-transform-cssobj](https://github.com/cssobj/babel-plugin-transform-cssobj) to simplify `mapClass`

**cssobj** can use in Vue component for better capsulation.

[fiddle demo](https://jsfiddle.net/futurist/22y6vm02/) Please open console and see **local class names** work!

**HTML**
```html
<template id="my-template">
  <ul class="{{'nav' | mapClass}}" @click="updateCSS">
    <li class="{{'!news item active' | mapClass}}">cssobj is awesome!</li>
  </ul>
</template>

<div id="app">
  <my-component></my-component>
</div>
```

**JS**
```javascript
// register a custom filter
Vue.filter('mapClass', function (value) {
  return this.result.mapClass(value)
})

// you component here
Vue.component('my-component', {
  template: '#my-template',
  data: function () {
    return {
      result: cssobj(obj, {local: true})
    }
  },
  methods: {
    updateCSS: function () {
      obj['.nav'].fontSize = '34px'
      this.result.update()
    }
  }
})

new Vue({
  el: '#app'
})
```

## Angular 1

Angular has more power to work with cssobj.

[fiddle demo](https://jsfiddle.net/futurist/2p420ykL/)

**HTML**
```html
<div ng-app>
  <div ng-controller="CssobjCtrl">
    <ul ng-class="mapClass('nav')" ng-click="updateCSS()">
      <li ng-class="mapClass('!news item active')">[+ click me +] cssobj is awesome!</li>
    </ul>
  </div>
</div>
```

**JS**
```javascript
function CssobjCtrl($scope) {
  var result = cssobj(obj, {
    local: true
  })

  $scope.updateCSS = function() {
    obj['.nav'].fontSize = '34px'
    result.update()
  }

  $scope.mapClass = function(list) {
    return result.mapClass(list)
  }

}
```

## Angular 2

Contribution welcome :)





