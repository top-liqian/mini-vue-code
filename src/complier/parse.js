// <div id="app">hello {{ school.name }} <span>world</span></div>
   
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 用来匹配标签名称aa-aa 即<aa-aa></aa-aa>
// ?:匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // my:xx 即命名空间标签 <my:xx></my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的 aa=aa aa="aa" aa='aa'
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >  <div></div> <br/>

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{ xxx }}
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/

// 数据结构 树、栈、链表、队列

export function parseHTML(html) {
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName, // 标签名
            type: 1, // 元素类型
            children: [], // 孩子类标
            attrs, // 属性集合
            parent: null // 父亲
        }
    }
    
    let root;
    let currentParent;
    let stack = [] // 利用数组模拟栈
    // 标签是否符合预期，校验标签是否合法，需要准备一个栈结构 [div, span]

    function start(tagName, attrs) {
        // console.log('tagName', tagName, attrs, '---开始标签--')
        let element = createASTElement(tagName, attrs)
        if (!root) { // 没有跟节点
            root = element 
        }
        currentParent = element // 当前解析的标签保存起来
        stack.push(element) // 将生成的ast元素放进栈中
    }
    
    function end(tagName) { // 在结尾标签处创建父子关系
        // console.log('tagName', tagName, '---结束标签---')
        // 改变当前的父亲  <div> <p></p> hello</div> [div, p] currentParent = p
        let element = stack.pop() // 取出栈当中的最后一个 p
        currentParent = stack[stack.length - 1] // currentParent = div
        if (currentParent) { // 在闭合的时候可以知道这个标签的父亲是谁
            element.parent = currentParent
            currentParent.children.push(element) 
        }
    }
    
    function chars(text) {
        // console.log('text', text, '--文本标签---')
        text = text.replace(/\s/g, '')
        if (text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }
    // 每解析一个标签就删除一个标签
    while(html) { // 只要html不为空就一直解析
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
           // 肯定是标签
           const startTagMatch = parseStartTag() // 开始标签的匹配结果
           
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }

            const endTagMatch = html.match(endTag)
            if(endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1]) // 将结束标签传入
                continue
            }
        }
        let text
        if (textEnd > 0) { // 文本
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length) // 删除匹配出来的字符串
        }
    }
    function advance(n) { // 将字符串进行截取操作，在更新html
       html = html.substring(n)
    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            }
            advance(start[0].length) // 删除开始标签
            let end
            let attr
            // 如果直接是闭合标签，说明没有属性
            // 不是结尾标签并且能够匹配到属性
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr) // 1 - 属性名称 3 - 属性值
                match.attrs.push({ 
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length)
            }
            if (end) { // > 删除匹配的结束标签
                advance(end[0].length)
                return match
            }
        } else {

        }
    }
    return root
}