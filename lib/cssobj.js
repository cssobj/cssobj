// cssobj is simply an intergration for cssobj-core, default-unit, cssom

import {arrayKV} from '../node_modules/cssobj-helper/lib/cssobj-helper.js'
import cssobj_core from './cssobj-core.js'
import cssobj_plugin_post_cssom from './cssobj-plugin-post-cssom.js'

export default function(obj, option) {
  option = option||{}
  option.plugins = option.plugins||{}
  arrayKV(option.plugins, 'post', cssobj_plugin_post_cssom())

  return cssobj_core(option)(obj)
}
