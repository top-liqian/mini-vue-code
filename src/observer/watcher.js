import { nextTick } from "../utils"
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
    run() {
        this.get() // 渲染逻辑
    }
    update() {
        // 批处理，不是每次都调用get方法，get方法会重新渲染页面
        // 把当前的wacther的get方法缓存起来
        queueWatcher(this) // 暂存
        // this.get() // 重新渲染
    }
}
let queue = [] // 将需要更新的wacther存在一个队列当中，稍后让watcher来执行
let has = {}
let pending = false

function flushShedulerQueue() {
    queue.forEach(watcher => {
        watcher.run()
        watcher.cb()
    })
    queue = [] // 清空watcher队列为了下次使用
    has = {} // 晴空标识的id
    pending = false
}

function queueWatcher(watcher) {
    // console.log(wacther.id)
    // 相同的wacther就不存储来
    const id = watcher.id // 对watcher进行去重
    if (has[id] == null) {
        queue.push(watcher) // 将wacther存在队列当中
        has[id] = true
        if (!pending) { // 如果还没有清空队列，就不要在开定时器了
            // 等待所有同步代码执行完毕之后在执行
            // setTimeout(() => {
            //     queue.forEach(watcher => watcher.run())
            //     queue = [] // 清空watcher队列为了下次使用
            //     has = {} // 晴空标识的id
            //     pending = false
            // }, 0)
            nextTick(flushShedulerQueue)
            pending = true
        }
    }
}

export default Watcher