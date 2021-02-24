import { observe } from './observer/index.js'
import { proxy } from './utils.js'

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

function initWatch(vm) {}
