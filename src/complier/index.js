import { parseHTML } from './parse'
import { generate } from './generate'
export function compileToFunctions(template) {
  // html模板 =》 render函数
  // 1. 需要将html代码转换成ast语法树，可以用ast树来描述语言本身
  /*
    虚拟dom区别于ast是虚拟dom是根据结构进行转换的，只能用来描述dom，用对象来描述节点, 可以添加自己的属性，为了避免操作真实dom产生的vue概念
    ast树则是对语法进行转换的，可以用来描述css，js，dom，根据语法生成的固定模式，用来描述代码的
    
    <div id="app"></div>

    {
        arrts: [{id: 'app'}],
        tag: div,
        children: []
    }
  */

   let ast = parseHTML(template)

   // 2. 优化静态节点

    // 3. 通过这颗树重新生成代码
    let code = generate(ast)
    
    // 4. 将字符串变成函数 -> 产生一个render函数 
    // 为了render函数当中的{{}} 里面的变量取到data里面的值，限制取值范围
    // 通过with来进行取值，稍后调用render函数就可以通过改变this 让这个函数内部取到结果了
    let render = new Function(`with(this){ return ${code} }`)
    
    return render
}