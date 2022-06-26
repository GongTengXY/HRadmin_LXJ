import request from '@/utils/request'
//权限接口封装

//获取所有权限
export const getAllPermission = () => request({
    url : '/sys/permission',
    method : 'get'
})

//新增权限
export const addPermission = (data) => request({
    url : '/sys/permission',
    method : 'post',
    data,
})

//更新权限
export const updatePermission = (data) => request({
    url : `/sys/permission/${data.id}`,
    method : 'put',
    data,
})

//获取权限点详情
export const getPermissionInfo = (id) => request({
    url : `/sys/permission/${id}`,
    method : 'get'
})