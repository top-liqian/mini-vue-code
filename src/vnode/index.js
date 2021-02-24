
export function renderMixin(Vue) { // 用对象来描述dom结构的
    Vue.prototype._c = function () { // 创建虚拟dom元素
        return createElement(...arguments)
    }

    // 1. 当结果是对象时，会对这个对象进行取值
    Vue.prototype._s = function (val) { // stringfy {{}}
       return val === null 
            ? '' 
            : (typeof val === 'object') 
                ? JSON.stringify(val) 
                : val
    }

    Vue.prototype._v = function (text) { // 创建虚拟dom文本元素
       return createTextVnode(text)
    }

    Vue.prototype._render = function() { // _render = render
        const vm = this
        // console.log('vm', vm)
        const render = vm.$options.render
        let vnode = render.call(vm)
        // console.log('vnode', vnode)
        return vnode
    }
}

function createElement(tag, data = {}, ...children) {
   return vnode(tag, data, data.key, children)
}

function createTextVnode (text) {
    return vnode(undefined, undefined, undefined, undefined,text)
}

// 产生虚拟dom
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text,
        // componentsInstabce: '', // 自定义的属性
        // slot: '',
    }
}