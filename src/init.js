import { initState } from './state'
import { compileToFunctions } from './complier/index.js'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './utils'
export function initMixin(Vue) {
    // 初始化方法
    Vue.prototype._init = function (options) {
      const vm = this
      // 不能直接使用Vue.options，使用父子组件的vm.constructor指向不同
      vm.$options = mergeOptions(vm.constructor.options, options) // 需要将用户自定义的options和全局的options做合并
      
      callHook(vm, 'beforeCreate' )

      // vue 核心特性 响应式数据原理
      // 初始化状态（将数据做一个初始化的劫持，当我改变数据时应该更新视图）
      // vue组件中有很多的状态 data props watch computed
      initState(vm) // 初始化状态

      callHook(vm, 'created' )
      // 如果当前具有el属性说明要渲染模版
      if(vm.$options.el) {
         vm.$mount(vm.$options.el) // 
      }
    }

    Vue.prototype.$mount = function (el) {
        // 挂载操作
        // 查找出来dom元素

        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        
        
        if (!options.render) {
           // template转换成render方法
           let template = options.template
            if (!template && el) {
               template = el.outerHTML
            }
           // 编译原理： 将模版编辑成render函数
           const render = compileToFunctions(template)
           options.render = render
        }

        // console.log(options.render) // 最终渲染的时候用的都是render函数
    
        // 有render了已经，需要挂载这个组件
        mountComponent(vm, el)
    }
}

