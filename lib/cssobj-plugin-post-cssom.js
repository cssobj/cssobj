// plugin for cssobj

import { dashify } from '../node_modules/cssobj-helper/lib/cssobj-helper.js'

function createDOM (id, option) {
  var el = document.createElement('style')
  document.getElementsByTagName('head')[0].appendChild(el)
  el.setAttribute('id', id)
  if (option && typeof option == 'object' && option.attrs)
    for (var i in option.attrs) {
      el.setAttribute(i, option.attrs[i])
    }
  return el
}

var addCSSRule = function (parent, selector, body, selPart) {
  var rules = parent.cssRules || parent.rules
  var pos = rules.length
  var omArr = []
  if ('insertRule' in parent) {
    try {
      parent.insertRule(selector + ' {' + body + '}', pos)
    } catch(e) {
      // the rule is not supported, fail silently
      // console.log(e, selector, body, pos)
    }
  } else if ('addRule' in parent) {
    // old IE addRule don't support 'dd,dl' form, add one by one
    ![].concat(selPart || selector).forEach(function (v) {
      try {
        parent.addRule(v, body, pos)
      } catch(e) {
        // console.log(e, selector, body)
      }
    })
  }

  for (var i = pos, len = rules.length; i < len; i++) {
    omArr.push(rules[i])
  }
  return omArr
}

function getBodyCss (prop) {
  // get cssText from prop
  return Object.keys(prop).map(function (k) {
    for (var v, ret = '', i = prop[k].length; i--;) {
      v = prop[k][i]
      ret += k.charAt(0) == '@'
        ? dashify(k) + ' ' + v + ';'
        : dashify(k) + ':' + v + ';'
    }
    return ret
  }).join('')
}

export default function cssobj_plugin_post_cssom (option) {
  option = option || {}

  if (!option.name) option.name = +new Date()
  option.name += ''

  var id = 'style_cssobj_' + option.name.replace(/[^a-zA-Z0-9$_]/g, '')

  var dom = document.getElementById(id) || createDOM(id, option)
  var sheet = dom.sheet || dom.styleSheet

  // IE has a bug, first comma rule not work! insert a dummy here
  addCSSRule(sheet, 'html,body', '')

  // helper regexp & function
  var reWholeRule = /keyframes|page/i
  var atomGroupRule = function (node) {
    return !node ? false : reWholeRule.test(node.at) || node.parentRule && reWholeRule.test(node.parentRule.at)
  }

  var getParent = function (node) {
    var p = node.parentRule
    return p && p.omGroup || sheet
  }

  var sugar = function (str) {
    return option.noSugar ? str : str
      .replace(/w\s*>=/ig, 'min-width:')
      .replace(/w\s*<=/ig, 'max-width:')
  }

  var validParent = function (node) {
    return !node.parentRule || node.parentRule.omGroup !== null
  }

  var removeOneRule = function (rule) {
    if (!rule) return
    var parent = rule.parentRule || sheet
    var rules = parent.cssRules || parent.rules
    var index = -1
    for (var i = 0, len = rules.length; i < len; i++) {
      if (rules[i] === rule) {
        index = i
        break
      }
    }
    if (index < 0) return
    parent.removeRule
      ? parent.removeRule(index)
      : parent.deleteRule(index)
  }

  function removeNode (node) {
    // remove mediaStore for old IE
    var groupIdx = mediaStore.indexOf(node)
    if (groupIdx > -1) {
      // before remove from mediaStore
      // don't forget to remove all children, by a walk
      node.mediaEnabled = false
      walk(node)
      mediaStore.splice(groupIdx, 1)
    }
    // remove Group rule and Nomal rule
    ![node.omGroup].concat(node.omRule).forEach(removeOneRule)
  }

  // helper function for addNormalrule
  var addNormalRule = function (node, selText, cssText, selPart) {
    // get parent to add
    var parent = getParent(node)
    if (validParent(node))
      node.omRule = addCSSRule(parent, selText, cssText, selPart)
    else if (node.parentRule) {
      // for old IE not support @media, check mediaEnabled, add child nodes
      if (node.parentRule.mediaEnabled) {
        if (!node.omRule) node.omRule = addCSSRule(parent, selText, cssText, selPart)
      }else if (node.omRule) {
        node.omRule.forEach(removeOneRule)
        delete node.omRule
      }
    }
  }

  var mediaStore = []

  var checkMediaList = function () {
    mediaStore.forEach(function (v) {
      v.mediaEnabled = v.mediaTest()
      walk(v)
    })
  }

  if (window.attachEvent) {
    window.attachEvent('onresize', checkMediaList)
  } else if (window.addEventListener) {
    window.addEventListener('resize', checkMediaList, true)
  }

  var walk = function (node, store) {
    if (!node) return

    // cssobj generate vanilla Array, it's safe to use constructor, fast
    if (node.constructor === Array) return node.map(function (v) {walk(v, store)})

    var postArr = []
    var children = node.children
    var isGroup = node.type == 'group'

    if (atomGroupRule(node)) store = store || []

    if (isGroup) {
      // if it's not @page, @keyframes (which is not groupRule in fact)
      if (!atomGroupRule(node)) {
        var reAdd = 'omGroup' in node
        node.omGroup = addCSSRule(sheet, sugar(node.groupText).replace(/([0-9.]+)\s*\)/g, '$1px)'), '{}').pop() || null

        // when add media rule failed, build test function then check on window.resize
        if (node.at == 'media' && !reAdd && !node.omGroup) {
          // build test function from @media rule
          var mediaTest = new Function(
            'return ' + sugar(node.groupText)
              .replace(/@media\s*/i, '')
              .replace(/min-width:/ig, '>=')
              .replace(/max-width:/ig, '<=')
              .replace(/(px)?\s*\)/ig, ')')
              .replace(/\s+and\s+/ig, '&&')
              .replace(/,/g, '||')
              .replace(/\(/g, '(document.documentElement.offsetWidth')
          )

          try {
            // first test if it's valid function
            mediaTest()
            node.mediaTest = mediaTest
            node.mediaEnabled = mediaTest()
            mediaStore.push(node)
          } catch(e) {}
        }
      }
    }

    var selText = node.selText
    var cssText = getBodyCss(node.prop)

    // it's normal css rule
    if (cssText) {
      if (!atomGroupRule(node)) {
        addNormalRule(node, selText, cssText, node.selTextPart)
      }
      store && store.push(selText ? selText + ' {' + cssText + '}' : cssText)
    }

    for (var c in children) {
      // emtpy key rule and media rule should add in top level, walk later
      if (c === '' || children[c].at == 'media') postArr.push(c)
      else walk(children[c], store)
    }

    if (isGroup) {
      // if it's @page, @keyframes
      if (atomGroupRule(node) && validParent(node)) {
        addNormalRule(node, node.groupText, store.join(''))
        store = null
      }
    }

    // media rules need a stand alone block
    postArr.map(function (v) {
      walk(children[v], store)
    })
  }

  return function (result) {
    result.cssdom = dom
    if (!result.diff) {
      // it's first time render
      walk(result.root)
    } else {
      // it's not first time, patch the diff result to CSSOM
      var diff = result.diff

      // node added
      if (diff.added) diff.added.forEach(function (node) {
        walk(node)
      })

      // node removed
      if (diff.removed) diff.removed.forEach(function (node) {
        // also remove all child group & sel
        node.childSel && node.childSel.forEach(removeNode)
        removeNode(node)
      })

      // node changed, find which part should be patched
      if (diff.changed) diff.changed.forEach(function (node) {
        var om = node.omRule
        var diff = node.diff

        if (!om) return

        // added have same action as changed, can be merged... just for clarity
        diff.added && diff.added.forEach(function (v) {
          om && om.forEach(function (rule) {
            rule.style[v] = node.prop[v][0]
          })
        })

        diff.changed && diff.changed.forEach(function (v) {
          om && om.forEach(function (rule) {
            rule.style[v] = node.prop[v][0]
          })
        })

        diff.removed && diff.removed.forEach(function (v) {
          om && om.forEach(function (rule) {
            rule.style.removeProperty
              ? rule.style.removeProperty(v)
              : rule.style.removeAttribute(v)
          })
        })
      })
    }

    return result
  }
}
