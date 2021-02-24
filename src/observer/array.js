// 拿到数组原来的方法
let oldArrayProtoMethods = Array.prototype

// 继承一下 arrayMethods.__proto__ = oldArrayProtoMethods

export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) { // this 就是observe里面的value
        // 当调用数组我们劫持后的这7个方法，页面应该更新
        // 我们要知道数组怎么更新，对应哪个dep
        const result = oldArrayProtoMethods[method].apply(this, args)
        let inserted
        let ob = this.__ob__
        switch(method) {
            case 'push':
            case 'unshift': // 这两个方法追加的内容有可能是对象，应该被再次劫持
                inserted = args
                break;
            case 'splice': // vue.$set原理 
                inserted = args.slice(2) // arr.splice(0, 1, {a: 1})
            default: 
                break;
        }
        if (inserted) ob.observeArray(inserted) // 给数组新增的值也要尽心监测
        ob.dep.notify() // 通知数组更新
        return result
    }
})