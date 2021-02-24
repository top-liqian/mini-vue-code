export function patch(oldvnode, vnode) {
    // 将虚拟节点转换成真实节点，递归创建元素的一个过程

   //  console.log('----', oldvnode, vnode)
    
   let el = createElm(vnode); // 产生真实的dom
   let parentElm = oldvnode.parentNode // 获取老的app的父亲 =》 body
   parentElm.insertBefore(el, oldvnode.nextSibling) // 当前的真实元素插入到app的后面

   parentElm.removeChild(oldvnode) // 删除老的节点

   return el
}

function createElm(vnode) {
   let { tag, children, key, data, text} = vnode
   if (typeof tag === 'string') { // 创建元素放在vnode.el
      vnode.el = document.createElement(tag)

      // 只有元素才有属性

      // console.log(vnode)

      updateProperties(vnode)

      // 遍历儿子，将儿子渲染后的结果丢在父亲当中
      children.forEach(child => vnode.el.appendChild(createElm(child)))
   } else { // 创建文本，放在vnode.el上
      vnode.el = document.createTextNode(text)
   }
   return vnode.el
}

function updateProperties(vnode) {
  let el = vnode.el
  let newProps = vnode.data || {}

  for (let key in newProps) {
      if (key === 'style') {
        for (let styleName in newProps.style) {
            el.style[styleName] = newProps.style[styleName]
        }
      } else if (key === 'class') {
         el.className = el.class
      } else {
         el.setAttribute(key, newProps[key])
      }
      
  }
}