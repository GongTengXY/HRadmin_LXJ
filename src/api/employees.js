// 员工接口的封装
import request from '@/utils/request'

//获取员工列表
export const getEmployeesList = (params) => request({
    url : '/sys/user',
    method : 'get',
    params,
})

//删除员工
export const deleteEmployee = (id) => request({
    url : `/sys/user/${id}`,
    method : 'delete'
})

//新增员工
export const addNewEmployee = (data) => request({
    url : '/sys/user',
    method : 'post',
    data,
})

//批量导入员工
export const importEmployees = (data) => request({
    url : '/sys/user/batch',
    method : 'post',
    data,
})

//保存员工个人基本信息
export const saveUserDetail = (data) => request({
    url : `/sys/user/${data.id}`,
    method : 'put',
    data,
})

//获取员工的基础信息
export const getEmployeeInfo = (id) => request({
    url : `/employees/${id}/personalInfo`,
    method : 'get'
})

//更新员工详情的基础信息
export const updatedEmployeeInfo = (data) => request({
    url : `/employees/${data.userId}/personalInfo`,
    method : 'put',
    data
})

//获取员工的岗位信息
export const getJobInfo = (id) => request({
    url : `/employees/${id}/jobs`,
    method : 'get'
})

//保存员工的岗位信息
export const saveJobInfo = (data) => request({
    url : `/employees/${data.userId}/jobs`,
    method : 'put',
    data,
})

//获取员工简单列表
export const getEasyList = () => request({
    url : '/sys/user/simple',
    method : 'get'
})

//给用户分配角色
export const assginRole = (data) => request({
    url : '/sys/user/assignRoles',
    method : 'put',
    data,
})
