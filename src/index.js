import { initMixin } from './init'
import  { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'
import { initGlobalApi } from './global-api/index'
function Vue (options) {
  this._init(options) // 入口初始化操作
}

// 原型方法:
// 写一个个插件进行对原型的扩展，方便管理
initMixin(Vue) // 初始化init

lifecycleMixin(Vue) // _update 区别于vue的原始生命周期created等等，这里的声明周期指的是组件的更新等，混合生命周期 -》 渲染

renderMixin(Vue) // _render

// 静态方法: Vue.component Vue.directive Vue.extend Vue.mixin

initGlobalApi(Vue)

// 初始化方法
export default Vue