//负责管理所有的自定义指令

export const imagerror = {
    //指令对象 会在当前的dom元素插入到节点之后执行
    inserted(dom, options) {
        //dom表示当前指令作用的dom对象
        //options表示里面指令的表达式
        // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
        dom.onerror = function() {
            //dom可以注册error事件
            dom.src = options.value      //这里不能写死
        }
        
    }
}