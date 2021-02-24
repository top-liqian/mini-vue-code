import { pushTarget, popTarget } from "./dep"

let id = 0 // 每一个组件只有一个watcher，id用来表示watcher
class Watcher {
    // vm - 实例
    // exprOrFn - vm._update(vm_render())
    // ob, options
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.id = id++ // wather的唯一标识
        this.deps = [] // wadcther记录有多少dep依赖他
        this.depsId = new Set()
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }
 
        this.get() // 默认会调用get方法
    }
    addDep(dep) {
        let id = dep.id
        // 去重操作
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    get() {
        // Dep.taregt = wacther
        pushTarget(this) // this - 当前wacther的实例
        this.getter() // 调用exprOrFn - vm._update(vm_render()) - 渲染页面取值（执行了get方法） - 调用rendder方法， with(vm) {}
        popTarget()
    }
    update() {
        this.get() // 重新渲染
    }
}

export default Watcher

// 前置条件： 在数据劫持的过程中，每一个属性在定义defineProperty的时候已经给每一个属性都增加了一个dep

// 1. 是把这个渲染wacther放在了Dep.target属性上
// 2. 开始渲染，取值会调用get方法，需要让这个属性的dep存储当前的wacther
// 3. 页面上所需要的属性都会将这个wacther放在自己的dep当中
// 4. 等会属性更新了，就会重新调用渲染逻辑，通知自己的wacther来进行更新