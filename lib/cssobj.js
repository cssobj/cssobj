// cssobj is simply an intergration for cssobj-core, cssom

import {arrayKV} from '../../cssobj-helper/lib/cssobj-helper.js'
import cssobj_core from '../../cssobj-core/lib/cssobj-core.js'
import cssobj_plugin_cssom from '../../cssobj-plugin-cssom/src/cssobj-plugin-cssom.js'
import cssobj_plugin_localize from '../../cssobj-plugin-localize/src/cssobj-plugin-localize.js'

function cssobj (obj, option, initData) {
  option = option||{}
  option.plugins = option.plugins||{}

  var local = option.local
  option.local = !local
    ? {prefix:''}
  : local && typeof local==='object' ? local : {}

  arrayKV(option, 'plugins', cssobj_plugin_cssom(option.cssom))
  arrayKV(option, 'plugins', cssobj_plugin_localize(option.local.prefix, option.local.localNames))

  return cssobj_core(option)(obj, initData)
}

cssobj.version = '<@VERSION@>'

export default cssobj
