import { arrayMethods } from './array.js'
import { defineProperty } from '../utils.js'
import Dep from './dep.js'
class Observer {
    constructor(value) {
        this.dep = new Dep() // data = {}, 给这个对象增加了一个dep， value = []
        // 判断一个对象是否被观测过， 看他有没有__ob__属性, 主要是将Observer赋值给this，在array里面可以使用observeArray
        defineProperty(value, '__ob__', this)
        // Object.defineProperty(value, '__ob__', {
        //     enumerable: false, // 不可枚举的好处： 不能被循环出来，定义的是一个隐藏属性
        //     configurable: false,
        //     value: this
        // })
        // value.__ob__ = this  会陷入死循环
        if (Array.isArray(value)) {
           // 重写数组的方法 push pop shifit unshift splice sort reverse
           // 进行函数劫持、切片编程
           value.__proto__ = arrayMethods
           // 观测数组倆面的对象
           this.observeArray(value) // 数组中普通类型是不做观测的
        } else {
            // 使用defineProperty重新定义属性
            this.walk(value)
        }
    }
    observeArray(value) {
        value.forEach(val => observe(val))
    }
    walk(data) {
        let keys = Object.keys(data) // 获取对象的key
        keys.forEach(key => {
            defineReactive(data, key, data[key]) // Vue.util.defineReactive
        })
    }
}

// 完全递归
function defineReactive (data, key, value) {
    // 获取到数组对应的dep
    let childDep = observe(value)

    let dep = new Dep() // 每一个属性都有一个dep

    // 当页面取值时，说明这个值用来渲染了，将这watcher和这个属性对应起来
    Object.defineProperty(data, key, {
        get() { // 依赖收集
            // console.log('取值')
            if(Dep.target) { // 让这个 属性记住这个wacther
                dep.depend()
                if(typeof childDep === 'object') {
                    // 默认给数组增加了一个dep属性，当对数组这个对象进行取值的时候
                    childDep.dep.depend() // 数组存起来了渲染过程
                }
            }
            return value
        },
        set(newValue) { // 依赖更新
            // 为什么不能直接data[key] = newValue
            // 答： 陷入死循环了，直接设置data[key]会再一次触发set函数
            // console.log('设置值', newValue)
            if (newValue === value) return
            observe(newValue) // 如果用户设置成对象，继续进行监测
            value = newValue 
            dep.notify()
        }
    })
}

export function observe (data) {
    // typeof null === 'object'
    if (typeof data !== 'object' || data === null)  return

    if (data.__ob__) return data // 好处： 防止被重复观测
      
    return new Observer(data)
}