import { patch } from './vnode/patch'
import Watcher from './observer/watcher'

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
    //   console.log('------', vnode)
        const vm = this
        // 用新的创建的元素替换原有的老得vm.$el
        vm.$el = patch(vm.$el, vnode)
    }
}

export function mountComponent(vm, el) {
    vm.$el = el // 保存起来，将虚拟dom渲染成真实dom的时候会使用到
    // 调用render方法去渲染el属性

    // 先调用render方法创建虚拟节点，再将虚拟节点渲染到页面上
    callHook(vm, 'beforeMount' )

    let updateComponent = () => {
        vm._update(vm._render())
    }
    // 初始化就会创建wacther
    // 这个watcher是用于渲染的，目前没有任何功能 updateComponent()
    let watcher = new Watcher(vm, updateComponent, () => {
        callHook(vm, 'updated' )
    }, true) // 渲染watcher只是一个名字
    // vm._update(vm._render())

    // 要把属性和watcher绑定在一起

    callHook(vm, 'mounted' )
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]; // vm.$options.created

    if (handlers) {
        for(let i = 0; i< handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}