//负责管理所有的自定义指令

export const imagerror = {
    //指令对象 inserted会在当前的dom元素插入到节点之后执行
    inserted(dom, options) {
        //dom表示当前指令作用的dom对象
        //options表示里面指令的表达式
        dom.src = dom.src || options.value   //这一步操作是为了初始化时，有值则赋值，无值则使用默认
        // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
        dom.onerror = function() {
            //dom可以注册error事件
            dom.src = options.value      //这里不能写死
        }
    },
    //该函数和inserted一样，也是钩子函数。
    componentUpdated(dom, options) {  //不过这个钩子函数会在当前指令作用的组件上 更新完数据时 执行
        //inserted只会执行一次
        //组件初始化后，一旦发生更新就不会进入inserted  会进入componentUpdated
        dom.src = dom.src || options.value
    }
}