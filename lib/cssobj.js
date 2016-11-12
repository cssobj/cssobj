// cssobj is simply an intergration for cssobj-core, cssom

import cssobj_core from '../../cssobj-core/lib/cssobj-core.js'
import cssobj_plugin_cssom from '../../cssobj-plugin-cssom/src/cssobj-plugin-cssom.js'
import cssobj_plugin_localize from '../../cssobj-plugin-localize/src/cssobj-plugin-localize.js'

function cssobj (obj, option, initData) {
  option = option||{}

  var local = option.local
  option.local = !local
    ? {space:''}
  : local && typeof local==='object' ? local : {}

  option.plugins = [].concat(
    option.plugins||[],
    cssobj_plugin_localize(option.local),
    cssobj_plugin_cssom(option.cssom)
  )

  return cssobj_core(option)(obj, initData)
}

cssobj.version = '<@VERSION@>'

export default cssobj
