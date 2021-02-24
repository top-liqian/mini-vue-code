let id = 0
class Dep {
    constructor() {
        this.subs = []
        this.id = id++
    }
    depend() {
        // 我们希望 watcher 可以存放dep
        Dep.target.addDep(this) // 实现双向记忆，让wacther记住dep的同时让dep也记住watcher
        // this.subs.push(Dep.target) // dep存放wacther
    }
    addSub(wacther) {
        this.subs.push(wacther)
    }
    notify() {
        this.subs.forEach(wacther => wacther.update())
    }
}

Dep.target = null

export function pushTarget(wacther) {
    Dep.target = wacther // 保留wacther
}

export function popTarget() {
    Dep.target = null // 将变量删除掉
}
export default Dep

// 多对多的关系， 一个属性有一个dep，dep是用来收集watcher的
// dep 可以存放多个wacther 也可以vm.$wacth 也会产生一个wacther 都会存在dep里面
// 一个wacther可以对应多个dep