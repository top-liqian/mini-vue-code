// <div id="app" style="color:red;"> hello {{name}}<span>world</span></div>
  
/*
render() {
    return _c(
        'div', 
        { 
            id: 'app', 
            style: { color: 'red'}, 
            _v('hello' + _s(name)), 
            _c('span', null, _v('world'))
        }
    )
}
*/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{ xxx }}

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i]
      if (attr.name === 'style') { // 对样式做特殊的处理
        let obj = {}
        attr.value.split(';').forEach(item => {
            let [key, value] = item.split(':');
            obj[key] = value
        });
        attr.value = obj

      }
      str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren (el) {
    const children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    } else {
        return undefined
    }
}
 
function gen (node) { // 将所有转换过后的儿子用逗号拼接起来
   // 文本 标签{}
    if (node.type === 1) {
       return generate(node) // 生成元素节点的字符串
    } else {
        let text = node.text // 获取文本
        // 普通文本， 不带{{}}
        // _v('hello {{ name }}') => _v('hello'+ _s(name))
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } 
        let tokens = [] // 存放每一段的代码 join('+')
        let lastIndex = defaultTagRE.lastIndex = 0 // 如果正则是全局模式，需要每次使用都置为0
        let match, index; // 每次匹配到的结果
        while(match = defaultTagRE.exec(text)) {
            index =  match.index // 匹配到的索引保存起来
            if(index > lastIndex) {
               tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            } 
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`
    }
}

export function generate(el) {
    let children = genChildren(el) // 儿子生成
    let code = `_c('${el.tag}',${
        el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${
        children ? `,${children}` : ''
    })`
    return code
}