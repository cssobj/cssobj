// cssobj is simply an intergration for cssobj-core, cssom

import {arrayKV} from '../../cssobj-helper/lib/cssobj-helper.js'
import cssobj_core from '../../cssobj-core/lib/cssobj-core.js'
import cssobj_plugin_post_cssom from '../../cssobj-plugin-post-cssom/src/cssobj-plugin-post-cssom.js'

export default function(obj, option, initData) {
  option = option||{}
  option.plugins = option.plugins||{}
  arrayKV(option.plugins, 'post', cssobj_plugin_post_cssom(option.cssom))

  return cssobj_core(option)(obj, initData)
}
