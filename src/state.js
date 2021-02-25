import { observe } from './observer/index.js'
import Watcher from './observer/watcher.js'
import { nextTick, proxy } from './utils.js'

export function initState(vm) { // vm.$options
  const opts = vm.$options
    // 初始化具有优先级 按照如下的顺序
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initProps(vm) {}

function initMethods(vm) {}

function initData(vm) { // 数据初始化
    let data = vm.$options.data
    
    vm._data = data = typeof data === 'function'
        ? data.call(vm)
        : data
    
    // 当我们去vm上面取属性值时，将属性的取值代理到vm._data
    for(let key in data) {
        proxy(vm, '_data', key)
    }

    // 数据劫持方案 对象Object.defineProperty
    // 数组 单独处理的
    observe(data) // 让这个对象重新定义set和get

}

function initComputed(vm) {}

function initWatch(vm) {
    let watch = vm.$options.watch
    for (let key in watch) {
        const handler = watch[key] // handler可能是数组、字符串、对象、函数

        if(Array.isArray(handler)) { // 数组
            handler.forEach(handle => {
                createWatcher(vm, key, handle)
            })
        } else {
            createWatcher(vm, key, handler) // 字符串、对象、函数
        }
    }
}

function createWatcher(vm, exprOrFn, handler, options = {}) { // options 用来标识是用户
    if (typeof handler === 'object') {
        options = handler
        handler = handler.handler; // 是一个函数
    }

    if (typeof handler === 'string') {
        handler = vm[handler] // 实例的方法作为handler
    }
    // key handler 用户传入的选项
    return vm.$watch(exprOrFn, handler, options)
}


export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
       nextTick(cb)
    }

    Vue.prototype.$watch = function (exprOrFn, cb, options) {
        // console.log('exprOrFn, handler, options', exprOrFn, handler, options)
        // 数据应该依赖这个watcher,数据变化后应该让wacther从新执行
        let vm = this
        let watcher = new Watcher(vm, exprOrFn, cb, {...options, user: true});

        if (options.immediate) {
            cb() // 如果是immediate 立刻执行
        }
    }
}