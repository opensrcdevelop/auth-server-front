import apiRequest from "@/util/apiRequest";

/**
 * 获取所有用户属性
 *
 * @param params 请求参数
 * @returns 所有用户属性
 */
export function getUserAttrs(params: any) {
  return apiRequest.get({
    url: "/user/attr/list",
    params,
  });
}

/**
 * 获取用户列表
 *
 * @param params 参数
 * @param data 请求体
 * @returns 用户列表
 */
export function getUserList(params: any, data: any = []) {
  return apiRequest.post({
    url: "/user/list",
    params,
    data,
  });
}

/**
 * 更新用户属性
 *
 * @param data 请求体
 * @returns 调用结果
 */
export function updateUserAttr(data: any) {
  return apiRequest.put({
    url: "/user/attr",
    data,
  });
}

/**
 * 设置用户属性显示顺序
 *
 * @param data 请求体
 * @returns 调用结果
 */
export function setUserAttrDisplaySeq(data: any) {
  return apiRequest.post({
    url: "/user/attr/seq",
    data,
  });
}

/**
 * 根据用户名搜索用户
 *
 * @param username 用户名
 * @param params 参数
 * @returns 搜索结果
 */
export function searchUser(username: string, params: any) {
  return apiRequest.post({
    url: "/user/list",
    params,
    data: [
      {
        key: "username",
        dataType: "STRING",
        value: username,
        filterType: "LIKE",
        extFlg: false,
      },
    ],
  });
}

/**
 * 获取用户详情
 *
 * @param id 用户 ID
 * @returns 用户详情
 */
export function getUserDetail(id: string) {
  return apiRequest.get({
    url: `/user/${id}`,
  });
}

/**
 * 更新用户信息
 *
 * @param data 用户信息
 * @returns 调用结果
 */
export function updateUser(data: any) {
  return apiRequest.put({
    url: "/user",
    data,
  });
}

/**
 * 创建用户
 *
 * @param data 创建用户表单
 * @returns 调用结果
 */
export function createUser(data: any) {
  return apiRequest.post({
    url: "/user",
    data,
  });
}

/**
 * 删除用户
 *
 * @param id 用户ID
 * @returns 调用结果
 */
export function removeUser(id: string) {
  return apiRequest.delete({
    url: `/user/${id}`,
  });
}

/**
 * 创建用户属性
 *
 * @param data 创建用户属性表单
 * @returns 调用结果
 */
export function createUserAttr(data: any) {
  return apiRequest.post({
    url: "/user/attr",
    data,
  });
}

/**
 * 获取用户属性详情
 *
 * @param id 用户属性ID
 * @returns 用户属性详情
 */
export function getUserAttrDetail(id: string) {
  return apiRequest.get({
    url: `/user/attr/${id}`,
  });
}

/**
 * 删除用户属性
 *
 * @param id 用户属性ID
 * @returns 调用结果
 */
export function deleteUserAttr(id: string) {
  return apiRequest.delete({
    url: `/user/attr/${id}`,
  });
}

/**
 * 获取当前用户信息
 *
 * @returns 当前用户信息
 */
export function getCurrentUser() {
  return apiRequest.get({
    url: "/user",
  });
}

/**
 * 重新绑定 MFA 设备
 *
 * @param id 用户 ID
 * @returns 调用结果
 */
export function rebindMfaDevice(id: string) {
  return apiRequest.put({
    url: `/user/${id}/mfa/device`,
  });
}

/**
 * 清空授权的 Token
 *
 * @param id 用户 ID
 * @returns 调用结果
 */
export function clearAuthorizedTokens(id: string) {
  return apiRequest.delete({
    url: `/user/${id}/token`,
  });
}

/**
 * 获取用户中心可见的用户属性
 *
 * @returns 用户中心可见的用户属性
 */
export function getVisibleUserAttrs() {
  return apiRequest.get({
    url: "/user/attr/list/visible",
  });
}

/**
 * 更新个人用户信息
 * 
 * @param data 个人用户信息
 * @returns 调用结果
 */
export function updateMyUserInfo(data: any) {
  return apiRequest.put({
    url: "/user/me",
    data,
  });
}

/**
 * 发送绑定邮箱验证码
 * 
 * @param to 邮箱
 * @returns 调用结果
 */
export function sendBindEmailCode (to: string) {
  return apiRequest.post({
    url: `/code/email/bind/${to}`,
  });
}

/**
 * 绑定邮箱
 * 
 * @param data 请求
 * @returns 调用结果
 */
export function bindEmail (data: any) {
  return apiRequest.post({
    url: '/user/me/email/bind',
    data,
  });
}

/**
 * 解绑邮箱
 * 
 * @param data 请求
 * @returns 调用结果
 */
export function unbindEmail (data: any) {
  return apiRequest.post({
    url: '/user/me/email/unbind',
    data,
  });
}

