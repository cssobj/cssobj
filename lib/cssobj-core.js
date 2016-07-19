/* lib cssobj */
'use strict'

/** IE ES3 need below polyfills:
 * Array.prototype.forEach
 * Array.prototype.indexOf
 * Array.prototype.map
 * Array.prototype.some
 * Array.prototype.reduce
 * Object.keys
 **/

import {
  defaults,
  random,
  isValidCSSValue,
  splitComma,
  getParents,
  strSugar,
  arrayKV,
  extendObj
} from '../node_modules/cssobj-helper/lib/cssobj-helper.js'

// using var as iteral to help optimize
var KEY_ID = '$id'
var KEY_ORDER = '$order'

var TYPE_GROUP = 'group'

// helper function
var keys = Object.keys

// type check helpers
var type = {}.toString
var ARRAY = type.call([])
var OBJECT = type.call({})

// only array, object now treated as iterable
function isIterable (v) {
  return type.call(v) == OBJECT || type.call(v) == ARRAY
}

// regexp constants
var reGroupRule = /^@(media|document|supports|page|keyframes) /i
var reAtRule = /^\s*@/g
var reClass = /:global\s*\(\s*((?:\.[A-Za-z0-9_-]+\s*)+)\s*\)|(\.)([!A-Za-z0-9_-]+)/g

/**
 * convert simple Object into node data
 *
 input data format:
 {"a":{"b":{"c":{"":[{color:1}]}}}, "abc":123, '@import':[2,3,4], '@media (min-width:320px)':{ d:{ok:1} }}
 *        1. every key is folder node
 *        2. "":[{rule1}, {rule2}] will split into several rules
 *        3. & will replaced by parent, \\& will escape
 *        4. all prop should be in dom.style camelCase
 *
 * @param {object|array} d - simple object data, or array
 * @param {object} result - the reulst object to store options and root node
 * @param {object} [previousNode] - also act as parent for next node
 * @param {boolean} init whether it's the root call
 * @returns {object} node data object
 */
function parseObj (d, result, node, init) {
  if (init) {
    result.nodes = []
    result.ref = {}
    if (node) result.diff = {}
  }

  node = node || {}

  if (type.call(d) == ARRAY) {
    return d.map(function (v, i) {
      return parseObj(v, result, node[i] || {parent: node, src: d, index: i, obj: d[i]})
    })
  }
  if (type.call(d) == OBJECT) {
    var opt = result.options
    var children = node.children = node.children || {}
    var prevVal = node.prevVal = node.lastVal
    node.lastVal = {}
    node.prop = {}
    node.diff = {}
    if (d[KEY_ID]) result.ref[d[KEY_ID]] = node
    var order = d[KEY_ORDER] | 0
    var funcArr = []

    // array index don't have key,
    // fetch parent key as ruleNode
    var ruleNode = getParents(node, function (v) {
      return v.key
    }).pop()

    node.parentRule = getParents(node.parent, function (n) {
      return n.type == TYPE_GROUP
    }).pop() || null

    if (ruleNode) {
      var isMedia, sel = ruleNode.key
      var groupRule = sel.match(reGroupRule)
      if (groupRule) {
        node.type = TYPE_GROUP
        node.at = groupRule.pop()
        isMedia = node.at == 'media'

        // only media allow nested and join, and have node.selPart
        if (isMedia) node.selPart = splitComma(sel.replace(reGroupRule, ''))

        node.groupText = isMedia
          ? '@' + node.at + ' ' + combinePath(getParents(ruleNode, function (v) {
            return v.type == TYPE_GROUP
          }, 'selPart', 'childSel'), '', ' and ')
        : sel

        node.selText = getParents(node, function (v) {
          return v.selText && !v.at
        }, 'selText').pop()
      } else if (reAtRule.test(sel)) {
        node.type = 'at'
        node.selText = sel
      } else {
        node.selText = localizeName('' + combinePath(getParents(ruleNode, function (v) {
          return v.selPart && !v.at
        }, 'selPart', 'childSel'), '', ' ', true), opt)
      }

      node.selText = applyPlugins(opt, 'selector', node.selText, node, result)
      if (node.selText) node.selTextPart = splitComma(node.selText)

      if (node !== ruleNode) node.ruleNode = ruleNode
    }

    for (var k in d) {
      if (!d.hasOwnProperty(k)) continue
      if (!isIterable(d[k]) || type.call(d[k]) == ARRAY && !isIterable(d[k][0])) {
        if (k.charAt(0) == '$') continue
        var r = function (_k) {
          parseProp(node, d, _k, result)
        }
        order
          ? funcArr.push([r, k])
          : r(k)
      } else {
        var haveOldChild = k in children
        var n = children[k] = parseObj(d[k], result, extendObj(children, k, {parent: node, src: d, key: k, selPart: splitComma(k), obj: d[k]}))
        // it's new added node
        if (prevVal && !haveOldChild) arrayKV(result.diff, 'added', n)
      }
    }

    // when it's second time visit node
    if (prevVal) {
      // children removed
      for (k in children) {
        if (!(k in d)) {
          arrayKV(result.diff, 'removed', children[k])
          delete children[k]
        }
      }

      // prop changed
      var diffProp = function () {
        var newKeys = keys(node.lastVal)
        var removed = keys(prevVal).filter(function (x) { return newKeys.indexOf(x) < 0 })
        if (removed.length) node.diff.removed = removed
        if (keys(node.diff).length) arrayKV(result.diff, 'changed', node)
      }
      order
        ? funcArr.push([diffProp, null])
        : diffProp()
    }

    if (order) arrayKV(result, '_order', {order: order, func: funcArr})
    result.nodes.push(node)
    return node
  }

  return node
}

function parseProp (node, d, key, result) {
  var prevVal = node.prevVal
  var lastVal = node.lastVal

  var prev = prevVal && prevVal[key]

  ![].concat(d[key]).forEach(function (v) {
    // pass lastVal if it's function
    var val = typeof v == 'function'
        ? v.call(node.lastVal, prev, node, result.ref, result)
        : v

    // only valid val can be lastVal
    if (isValidCSSValue(val)) {
      // push every val to prop
      arrayKV(
        node.prop,
        key,
        applyPlugins(result.options, 'value', val, key, node, result),
        true
      )
      prev = lastVal[key] = val
    }
  })
  if (prevVal) {
    if (!(key in prevVal)) {
      arrayKV(node.diff, 'added', key)
    } else if (prevVal[key] != lastVal[key]) {
      arrayKV(node.diff, 'changed', key)
    }
  }
}

function combinePath (array, prev, sep, rep) {
  return !array.length ? prev : array[0].reduce(function (result, value) {
    var str = prev ? prev + sep : prev
    if (rep) {
      var isReplace = false
      var sugar = strSugar(value, '&', function (z) {
        isReplace = true
        return prev
      })
      str = isReplace ? sugar : str + sugar
    } else {
      str += value
    }
    return result.concat(combinePath(array.slice(1), str, sep, rep))
  }, [])
}

function localizeName (str, opt) {
  var NS = opt.localNames
  var replacer = function (match, global, dot, name) {
    if (global) {
      return global
    }
    if (name[0] === '!') {
      return dot + name.substr(1)
    }

    if (!opt.local) {
      NS[name] = name
    } else if (!NS[name]) {
      NS[name] = opt.prefix + name
    }

    return dot + NS[name]
  }

  return str.replace(reClass, replacer)
}

function applyPlugins (opt, type) {
  var args = [].slice.call(arguments, 2)
  var plugin = opt.plugins[type]
  return !plugin ? args[0] : [].concat(plugin).reduce(
    function (pre, f) { return f.apply(null, [pre].concat(args)) },
    args.shift()
  )
}

function applyOrder (opt) {
  if (!opt._order) return
  opt._order
    .sort(function (a, b) {
      return a.order - b.order
    })
    .forEach(function (v) {
      v.func.forEach(function (f) {
        f[0](f[1])
      })
    })
  delete opt._order
}

function cssobj (options) {

  options = defaults(options, {
    local: true,
    prefix: random(),
    localNames: {},
    plugins: {}
  })

  return function (obj, initData) {
    var updater = function (data) {
      result.data = data || {}

      result.root = parseObj(result.obj || {}, result, result.root, true)
      applyOrder(result)
      return applyPlugins(options, 'post', result)
    }

    var result = {
      obj: obj,
      map: options.localNames,
      update: updater,
      options: options
    }

    updater(initData)

    return result
  }
}

// no optins
// console.log(cssobj({p:{color:123}}).css)

// // save options
// window.a = cssobj(obj, window.a? window.a.options : {})
// console.log(a.css)

// module exports
export default cssobj
