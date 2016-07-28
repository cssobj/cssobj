// cssobj is simply an intergration for cssobj-core, cssom

import {arrayKV} from '../../cssobj-helper/lib/cssobj-helper.js'
import cssobj_core from '../../cssobj-core/lib/cssobj-core.js'
import cssobj_plugin_post_cssom from '../../cssobj-plugin-post-cssom/src/cssobj-plugin-post-cssom.js'
import cssobj_plugin_selector_localize from '../../cssobj-plugin-selector-localize/src/cssobj-plugin-selector-localize.js'

export default function(obj, option, initData) {
  option = option||{}
  option.plugins = option.plugins||{}

  var local = option.local
  option.local = !local
    ? {prefix:''}
  : local && typeof local==='object' ? local : {}

  arrayKV(option.plugins, 'post', cssobj_plugin_post_cssom(option.cssom))
  arrayKV(option.plugins, 'selector', cssobj_plugin_selector_localize(option.local.prefix, option.local.localNames))

  return cssobj_core(option)(obj, initData)
}
