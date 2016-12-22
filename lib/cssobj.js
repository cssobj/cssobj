// cssobj is simply an intergration for cssobj-core, cssom

import cssobj_core from '../../cssobj-core/lib/cssobj-core.js'
import cssobj_plugin_cssom from '../../cssobj-plugin-cssom/src/cssobj-plugin-cssom.js'
import cssobj_plugin_localize from '../../cssobj-plugin-localize/src/cssobj-plugin-localize.js'

function cssobj (obj, config, state) {
  config = config || {}

  var local = config.local
  config.local = !local
    ? {space: ''}
  : local && typeof local === 'object' ? local : {}

  config.plugins = [].concat(
    config.plugins || [],
    cssobj_plugin_localize(config.local),
    cssobj_plugin_cssom(config.cssom)
  )

  return cssobj_core(config)(obj, state)
}

cssobj.version = '<@VERSION@>'

export default cssobj
