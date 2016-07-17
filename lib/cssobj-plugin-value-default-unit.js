// cssobj value plugin

import {dashify} from '../node_modules/cssobj-helper/lib/cssobj-helper.js'

var unitless = [
  "animation-iteration-count",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "columns",
  "column-count",
  "fill-opacity",
  "flex",
  "flex-grow",
  "flex-positive",
  "flex-negative",
  "flex-order",
  "flex-shrink",
  "font-weight",
  "line-height",
  "line-clamp",
  "opacity",
  "order",
  "orphans",
  "stop-opacity",
  "stroke-dash-offset",
  "stroke-opacity",
  "stroke-width",
  "tab-size",
  "widows",
  "z-index",
  "zoom"
]


export default function cssobj_plugin_value_default_unit (unit) {

  unit = unit || 'px'

  return function(value, key, node, result) {

    var base = dashify(key).replace(
        /^[^a-zA-Z]*(?:ms-|o-|webkit-|moz-|khtml-)?|[^a-zA-Z]+$/g,
      '')

    // here **ignored** value===''||value===null,
    // which is false for isNaN.
    // cssobj never have this value
    return (isNaN(value)
            || unitless.indexOf(base)>-1
           )
      ? value
      : value + unit

  }

}




