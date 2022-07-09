import store from '@/store'
//导出一个所有组件都可以使用的方法
export default {
    methods: {
        checkPermission(key) {
            const {userInfo} = store.state.user
            if (userInfo.roles.points && userInfo.roles.points.length) {
                return userInfo.roles.points.some(item => item === key)
            }
            return false
        }
    }
}