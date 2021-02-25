// 代理
export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key]
        },
        set(newValue) {
            vm[data][key] = newValue
        }
    })
}

export function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
        enumerable: false,
        configurable: false,
        value,
    })
}
export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destoryed'
]

// 定义策略模式
const strats = {}

strats.data = function (parentVal, childVal) {
    return childVal // 这里应该有合并策略，暂时先不考虑
}

strats.computed = function () {}

function mergeHook (parentVal, childVal) { // 生命周期合并
    if(childVal) {
        if (parentVal) {
            return parentVal.concat(childVal) // 父亲儿子需要拼接
        } else {
            return [childVal] // 儿子需要转换成数组
        }
    } else {
        return parentVal // 不合并了，采用父亲的
    }
} 

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
export function mergeOptions(parent, child){
    // 遍历父亲，可能父亲有， 儿子没有
    const options = {}

    for(let key in parent) { // 父亲和儿子都有在这里就已经处理了
        mergeFiled(key)
    }
    // 儿子有父亲没有

    for(let key in child) { 
        if (!parent.hasOwnProperty(key)){
            mergeFiled(key)
        } 
    }

    function mergeFiled(key) { // 合并字段
        // 根据key不同的策略进行合并
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            // todo默认合并，暂时先不处理，临时方案
            options[key] = child[key]
        }
    }
    
    return options
}

let callbacks = []
let pending = false

function flushCallbacks () {
    while(callbacks.length) {
        let cb = callbacks.pop()
        cb()
    }
    // callbacks.forEach(cb => cb()) // 让nextTick中传入的方法依次执行
    pending = false // 标识已经执行完毕
    // callbacks = []
}

let timerFunc
// 兼容处理
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks) // 异步处理更新
    }
} else if (MutationObserver) { // 可以监控dom的变化，监控完毕之后异步更新
    let observer = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1) // 创建一个文本节点
    observer.observe(textNode, { characterData: true }) // 观测文本节点的内容
    timerFunc = () => {
        textNode.textContent = 2 // 文本节点内容改成2
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    setTimeout(flushCallbacks)
}


export function nextTick(cb) {
//   console.log('cb', cb)
  // cb 存在两种方式，一种是更新数据时候调用的方法，还有一种是用户直接手动调用vm.$nextTick,默认我们要先更改数据在去执行用户手动添加的cb
  callbacks.push(cb)
  // vue3里面的nextTiock的原理就是使用的promise.then 没有做兼容性处理
  //   Promise.resolve().then()
  // 此处仍然做vue2的处理

  // 因为内部会调用nextTick，用户也会调用，但是异步只需要一次
  if (!pending) {
    timerFunc() // 这个方法是异步方法，做了兼容处理
    pending = true
  }
  
}