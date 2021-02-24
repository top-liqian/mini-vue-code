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