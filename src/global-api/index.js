import { mergeOptions } from '../utils'

export function initGlobalApi (Vue) {
    Vue.options = {}
    Vue.mixin = function (mixin) {
        // 第一次父亲是Vue.options = {}，子是Vue.mixin - a
        // 第二次父亲是[created]，子是Vue.mixin - b
        this.options = mergeOptions(this.options, mixin) // 合并选项（先考虑生命周期，先不考虑其他的合并）
        // console.log(this.options, '9999999') // this.options = { created: [a,b]}
    }
    // 用户 new Vue时候还会在传递过来一个new Vue({ create(){}})

    
}

