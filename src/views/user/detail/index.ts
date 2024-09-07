import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import router from "@/router";
import {
  clearAuthorizedTokens,
  getUserAttrs,
  getUserDetail,
  rebindMfaDevice,
  updateUser,
} from "@/api/user";
import {
  generateRandomString,
  handleApiError,
  handleApiSuccess,
} from "@/util/tool";
import { useRoute } from "vue-router";
import { Modal, Notification } from "@arco-design/web-vue";
import { addRoleMapping, getRoleList, removeRoleMapping } from "@/api/role";
import {
  addUserGroupMapping,
  getUserGroupList,
  removeUserGroupMapping,
} from "@/api/userGroup";
import { cancelAuthorization } from "@/api/permission";
import { useGlobalVariablesStore } from "@/store/globalVariables";

/**
 * 返回上一级
 */
const handleBack = () => {
  router.back();
};

const activeTab = ref("user_info");

/**
 * tab 切换事件
 *
 * @param tabKey tabKey
 */
const handleTabChange = (tabKey: string) => {
  router.replace({
    query: {
      ...router.currentRoute.value.query,
      active_tab: tabKey,
    },
  });
  activeTab.value = tabKey;
};

const userId = ref("");
const username = ref("");

/** 账号信息 */
const accountInfoForm = reactive({
  userId: "",
  createTime: "",
  lastLoginTime: "",
  lastLoginIp: "",
  lastLoginDeviceType: "",
  lastLoginDeviceOs: "",
});

/** 个人信息 */
const userInfoForm = reactive({
  userId: "",
  username: "",
  phoneNumber: "",
  emailAddress: "",
});
const userInfoFormRef = ref();

/** 所有用户扩展属性 */
const allUserExtAttrs = reactive([]);
const userAttrs = reactive([]);

/** 用户角色 */
const userRoles = reactive([]);
/** 所属用户组 */
const userGroups = reactive([]);
/** 权限 */
const permissions = reactive([]);

/** 账户禁用状态 */
const accountLocked = ref(false);

/** MFA（多因素认证）状态 */
const enableMfa = ref(false);

/** 控制台访问状态 */
const consoleAccess = ref(false);

/**
 * 获取用户详情
 *
 * @param id 用户ID
 */
const handleGetUserDetail = (id: string) => {
  getUserDetail(id)
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        userId.value = data.id;
        username.value = data.username;

        accountInfoForm.userId = data.id;
        accountInfoForm.createTime = data.createTime;
        accountInfoForm.lastLoginTime = data.lastLoginTime;
        accountInfoForm.lastLoginIp = data.lastLoginIp;
        accountInfoForm.lastLoginDeviceType = data.lastLoginDeviceType;
        accountInfoForm.lastLoginDeviceOs = data.lastLoginDeviceOs;

        userInfoForm.userId = data.id;
        userInfoForm.username = data.username;
        userInfoForm.phoneNumber = data.phoneNumber;
        userInfoForm.emailAddress = data.emailAddress;

        userAttrs.length = 0;
        userAttrs.push(...data.attributes);

        userRoles.length = 0;
        userRoles.push(...data.roles);

        userGroups.length = 0;
        userGroups.push(...data.userGroups);

        permissions.length = 0;
        permissions.push(...data.permissions);

        resetPwdForm.rawEmail = data.emailAddress;
        resetPwdForm.userId = data.id;

        accountLocked.value = data.locked;

        enableMfa.value = data.enableMfa;

        consoleAccess.value = data.consoleAccess;
      });
      ("");
    })
    .catch((err: any) => {
      handleApiError(err, "获取用户详情");
    });
};

/**
 * 获取全部用户扩展属性
 */
const handleGetUserExtAttrs = () => {
  getUserAttrs({
    page: 1,
    size: -1,
  })
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        allUserExtAttrs.length = 0;
        data.list.forEach((item: any) => {
          if (item.extFlg) {
            allUserExtAttrs.push(item);
          }
        });
      });
    })
    .catch((err: any) => {
      handleApiError(err, "获取用户扩展属性");
    });
};

/**
 * 用户扩展属性值
 */
const userAttrValues = computed(() => {
  const userAttrValues = [];
  allUserExtAttrs.map((item: any) => {
    const userAttr = userAttrs.find((attr: any) => attr.key === item.key);
    if (userAttr) {
      userAttrValues.push(userAttr.value);
    } else {
      userAttrValues.push(null);
    }
  });
  return reactive(userAttrValues);
});

/**
 * 设置账号状态
 *
 * @param locked 账号状态
 */
const handleSetAccountStatus = (locked: boolean) => {
  updateUser({
    userId: userId.value,
    locked,
  })
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success(locked ? "禁用成功" : "启用成功");
        handleGetUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "更新用户信息");
    });
};

/**
 * 设置 MFA 状态
 *
 * @param enableMfa MFA 状态
 */
const handleSetMfaStatus = (enableMfa: boolean) => {
  updateUser({
    userId: userId.value,
    enableMfa,
  })
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success(enableMfa ? "启用 MFA 成功" : "关闭 MFA 成功");
        handleGetUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "更新用户信息");
    });
};

/**
 * 重新绑定 MFA 设备
 */
const handleRebindMfaDevice = () => {
  rebindMfaDevice(userId.value)
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("重新绑定 MFA 设备成功");
      });
    })
    .catch((err: any) => {
      handleApiError(err, "重新绑定 MFA 设备");
    });
};

/**
 * 设置控制台访问状态
 *
 * @param consoleAccess 控制台访问状态
 */
const handleSetConsoleAccessStatus = (consoleAccess: boolean) => {
  updateUser({
    userId: userId.value,
    consoleAccess,
  })
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success(
          consoleAccess ? "开启控制台访问成功" : "关闭控制台访问成功"
        );
        handleGetUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "更新用户信息");
    });
};

/**
 * 清除授权
 */
const handleClearAuthorizedTokens = () => {
  clearAuthorizedTokens(userId.value)
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("清除授权成功");
      });
    })
    .catch((err: any) => {
      handleApiError(err, "清除授权");
    });
};

/**
 * 提交个人信息表单
 *
 * @param formData 个人信息表单
 */
const handleUserInfoFormSubmit = (formData: any) => {
  updateUser(formData)
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("保存成功");
        getUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "更新用户信息");
    });
};

/**
 * 提交用户扩展属性表单
 */
const handleUserAttrsSubmit = () => {
  const userAttrs = [];
  allUserExtAttrs.forEach((item: any, index: number) => {
    userAttrs.push({
      attrId: item.id,
      attrValue: userAttrValues.value[index],
    });
  });
  updateUser({
    userId: userId.value,
    attributes: userAttrs,
  })
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("保存成功");
        getUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "更新用户信息");
    });
};

/**
 * 重置个人信息表单
 */
const handleResetUserInfoForm = () => {
  userInfoFormRef.value.resetFields();
  handleGetUserDetail(userId.value);
};

/**
 * 重置用户扩展属性
 */
const handleResetUserAttrs = () => {
  handleGetUserDetail(userId.value);
};

/**
 * 撤销用户角色
 *
 * @param role 角色
 */
const handleRemoveUserRole = (role: any) => {
  Modal.warning({
    title: `确定撤销角色「${role.name}」吗？`,
    content: `撤销后该用户将失去「${role.name}」所拥有的权限。`,
    hideCancel: false,
    okButtonProps: {
      status: "danger",
    },
    onOk: () => {
      removeRoleMapping({
        userIds: [userId.value],
        roleIds: [role.id],
      })
        .then((result: any) => {
          handleApiSuccess(result, () => {
            Notification.success("撤销成功");
            handleGetUserDetail(userId.value);
          });
        })
        .catch((err: any) => {
          handleApiError(err, "撤销角色");
        });
    },
  });
};

/**
 * 移除用户组
 *
 * @param group 用户组
 */
const handleRemoveUserGroup = (group: any) => {
  Modal.warning({
    title: `确定移除用户组「${group.name}」吗？`,
    content: "此操作不可恢复，请谨慎操作。",
    hideCancel: false,
    okButtonProps: {
      status: "danger",
    },
    onOk: () => {
      removeUserGroupMapping({
        userIds: [userId.value],
        userGroupIds: [group.id],
      })
        .then((result: any) => {
          handleApiSuccess(result, () => {
            Notification.success("移除成功");
            handleGetUserDetail(userId.value);
          });
        })
        .catch((err: any) => {
          handleApiError(err, "移除用户组");
        });
    },
  });
};

const roleList = reactive([]);
const roleListPagination = {
  current: 1,
  total: 0,
};
const roleSearchKeyword = ref("");
const addUserRoleModalVisible = ref(false);

const addUserRoleFormRef = ref();
const addUserRoleForm = reactive({
  roleIds: [],
});
const addUserRoleFormRules = {
  roleIds: [
    {
      required: true,
      message: "至少选择一项",
    },
  ],
};

/**
 * 获取角色列表
 */
const handleGetRoleList = (page: number = 1, size: number = 15) => {
  getRoleList({
    page,
    size,
    keyword: roleSearchKeyword.value,
  })
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        if (page == 1) {
          roleList.length = 0;
          roleList.push(...data.list);
        } else {
          roleList.push(...data.list);
        }
        roleListPagination.current = data.current;
        roleListPagination.total = data.total;
      });
    })
    .catch((err: any) => {
      handleApiError(err, "获取角色列表");
    });
};

/**
 * 搜索角色
 */
const handleSearchRole = () => {
  handleGetRoleList(1);
};

/**
 * 加载更多角色
 */
let loadMoreRoleLoading = false;
const loadMoreRole = () => {
  if (loadMoreRoleLoading) return;
  if (roleList.length < roleListPagination.total) {
    loadMoreRoleLoading = true;
    roleListPagination.current++;
    handleGetRoleList(roleListPagination.current);
    loadMoreRoleLoading = false;
  }
};

/**
 * 打开添加用户角色对话框
 */
const handleOpenAddUserRoleModal = () => {
  handleGetRoleList();
  addUserRoleModalVisible.value = true;
};

/**
 * 关闭添加用户角色对话框
 */
const handleCloseAddUserRoleModal = () => {
  addUserRoleFormRef.value.resetFields();
  addUserRoleModalVisible.value = false;
};

/**
 * 提交添加用户角色表单
 *
 * @param formData 添加用户角色表单
 */
const addUserRoleFormSubmitLoading = ref(false);
const handleAddUserRoleFormSubmit = (formData: any) => {
  addUserRoleFormSubmitLoading.value = true;
  addRoleMapping({
    userIds: [userId.value],
    roleIds: formData.roleIds,
  })
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("添加成功");
        handleCloseAddUserRoleModal();
        handleGetUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "添加角色");
    })
    .finally(() => {
      addUserRoleFormSubmitLoading.value = false;
    });
};

/** 用户组列表 */
const userGroupList = reactive([]);
const userGroupListPagination = {
  current: 1,
  total: 0,
};
const userGroupSearchKeyword = ref("");
const addUserGroupModalVisible = ref(false);

const addUserGroupFormRef = ref();
const addUserGroupForm = reactive({
  userGroupIds: [],
});
const addUserGroupFormRules = {
  userGroupIds: [
    {
      required: true,
      message: "至少选择一项",
    },
  ],
};

/**
 * 获取用户组列表
 */
const handleGetUserGroupList = (page: number = 1, size: number = 15) => {
  getUserGroupList({
    page,
    size,
    keyword: userGroupSearchKeyword.value,
  }).then((result: any) => {
    handleApiSuccess(result, (data: any) => {
      if (page == 1) {
        userGroupList.length = 0;
        userGroupList.push(...data.list);
      } else {
        userGroupList.push(...data.list);
      }
      userGroupListPagination.current = data.current;
      userGroupListPagination.total = data.total;
    });
  });
};

/**
 * 搜索用户组
 */
const handleSearchUserGroup = () => {
  handleGetUserGroupList(1);
};

/**
 * 加载更多用户组
 */
let loadMoreUserGroupLoading = false;
const loadMoreUserGroup = () => {
  if (loadMoreUserGroupLoading) return;
  if (userGroupList.length < userGroupListPagination.total) {
    loadMoreUserGroupLoading = true;
    userGroupListPagination.current++;
    handleGetUserGroupList(userGroupListPagination.current);
    loadMoreUserGroupLoading = false;
  }
};

/**
 * 打开添加用户组对话框
 */
const handleOpenAddUserGroupModal = () => {
  handleGetUserGroupList();
  addUserGroupModalVisible.value = true;
};

/**
 * 关闭添加用户组对话框
 */
const handleCloseAddUserGroupModal = () => {
  addUserGroupFormRef.value.resetFields();
  addUserGroupModalVisible.value = false;
};

/**
 * 提交添加用户组表单
 *
 * @param formData 用户组表单
 */
const addUserGroupFormSubmitLoading = ref(false);
const handleAddUserGroupFormSubmit = (formData: any) => {
  addUserGroupFormSubmitLoading.value = true;
  addUserGroupMapping({
    userIds: [userId.value],
    userGroupIds: formData.userGroupIds,
  })
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("添加成功");
        handleCloseAddUserGroupModal();
        handleGetUserDetail(userId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "添加用户组");
    })
    .finally(() => {
      addUserGroupFormSubmitLoading.value = false;
    });
};

/** 重置密码对话框 */
const resetPwdModalVisible = ref(false);

const resetPwdForm = reactive({
  userId: "",
  password: "",
  rawEmail: "",
  emailAddress: "",
  needChangePwd: true,
  sendEmail: true,
});

const resetPwdFormRules = {
  password: [
    {
      required: true,
      message: "密码未填写",
    },
  ],
  emailAddress: [
    {
      validator: (value, cb) => {
        if (resetPwdForm.sendEmail && !resetPwdForm.rawEmail && !value) {
          cb("邮箱未填写");
        } else {
          cb();
        }
      },
    },
  ],
};
const resetPwdFormRef = ref();

const resetPwdFormSubmitLoading = ref(false);

/** 打开重置密码对话框 */
const handleOpenResetPwdModal = () => {
  resetPwdModalVisible.value = true;
};

/** 关闭重置密码对话框 */
const handleCloseResetPwdModal = () => {
  resetPwdFormRef.value.resetFields();
  resetPwdModalVisible.value = false;
};

/**
 * 生成随机密码
 */
const handleGeneratePassword = () => {
  resetPwdForm.password = generateRandomString(12);
};

/**
 * 提交重置密码表单
 */
const handleResetPwdFormSubmit = () => {
  if (resetPwdForm.rawEmail && !resetPwdForm.emailAddress) {
    resetPwdForm.emailAddress = resetPwdForm.rawEmail;
  }

  delete resetPwdForm.rawEmail;
  if (!resetPwdForm.sendEmail) {
    delete resetPwdForm.emailAddress;
  }

  resetPwdFormSubmitLoading.value = true;
  updateUser(resetPwdForm)
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("重置密码成功");
        handleCloseResetPwdModal();
      });
    })
    .catch((err: any) => {
      handleApiError(err, "重置密码");
    })
    .finally(() => {
      resetPwdFormSubmitLoading.value = false;
    });
};

/**
 * 取消授权
 */
const handleCancelAuthorization = (permission: any) => {
  Modal.warning({
    title: `确定取消对权限「${permission.permissionName}」的授权吗？`,
    content: "此操作不可恢复，请谨慎操作。",
    hideCancel: false,
    okButtonProps: {
      status: "danger",
    },
    onOk: () => {
      cancelAuthorization(permission.permissionId, userId.value)
        .then((result: any) => {
          handleApiSuccess(result, () => {
            Notification.success("取消授权成功");
            handleGetUserDetail(userId.value);
          });
        })
        .catch((err: any) => {
          handleApiError(err, "取消授权");
        });
    },
  });
};

/**
 * 跳转角色详情
 *
 * @param role 角色
 */
const handleToRoleDetail = (role: any) => {
  router.push({
    path: "/role/detail",
    query: {
      id: role.id,
    },
  });
};

/**
 * 跳转用户组详情
 *
 * @param userGroup 用户组
 */
const hantoToUserGroupDetail = (userGroup: any) => {
  router.push({
    path: "/user/group/detail",
    query: {
      id: userGroup.id,
    },
  });
};

/** 授权对话框 */
const authorizeVisible = ref(false);

/**
 * 授权
 */
const handleAuthorize = () => {
  const globalVariables = useGlobalVariablesStore();
  globalVariables.authorizeOptions.principal = username.value;
  globalVariables.authorizeOptions.principalId = userId.value;
  globalVariables.authorizeOptions.principalType = "USER";

  authorizeVisible.value = true;
};

/**
 * 跳转资源组详情
 */
const handleToResourceGroupDetail = (id: string) => {
  router.push({
    path: "/resource/group/detail",
    query: {
      id,
    },
  });
};

/**
 * 跳转资源详情
 */
const handleToResourceDetail = (id: string) => {
  router.push({
    path: "/permission/resource/detail",
    query: {
      id,
    },
  });
};

/**
 * 跳转权限详情
 */
const handleToPermissionDetail = (id: string) => {
  router.push({
    path: "/permission/detail",
    query: {
      id,
    },
  });
};

export default defineComponent({
  setup() {
    onMounted(() => {
      const route = useRoute();
      if (route.query.active_tab) {
        activeTab.value = route.query.active_tab as string;
      }
      const userId = route.query.id as string;
      handleGetUserDetail(userId);
      handleGetUserExtAttrs();
    });

    return {
      handleBack,
      activeTab,
      handleTabChange,
      userId,
      username,
      userInfoForm,
      accountInfoForm,
      allUserExtAttrs,
      userAttrValues,
      handleUserInfoFormSubmit,
      handleUserAttrsSubmit,
      userInfoFormRef,
      handleResetUserInfoForm,
      handleResetUserAttrs,
      userRoles,
      userGroups,
      permissions,
      handleRemoveUserRole,
      handleRemoveUserGroup,
      addUserRoleModalVisible,
      handleOpenAddUserRoleModal,
      addUserRoleForm,
      roleList,
      roleSearchKeyword,
      loadMoreRole,
      handleSearchRole,
      addUserRoleFormRules,
      addUserRoleFormRef,
      handleCloseAddUserRoleModal,
      addUserRoleFormSubmitLoading,
      handleAddUserRoleFormSubmit,
      userGroupList,
      userGroupSearchKeyword,
      loadMoreUserGroup,
      handleSearchUserGroup,
      addUserGroupModalVisible,
      handleOpenAddUserGroupModal,
      handleCloseAddUserGroupModal,
      addUserGroupForm,
      addUserGroupFormRules,
      addUserGroupFormRef,
      addUserGroupFormSubmitLoading,
      handleAddUserGroupFormSubmit,
      handleOpenResetPwdModal,
      handleCloseResetPwdModal,
      resetPwdModalVisible,
      resetPwdFormRef,
      resetPwdForm,
      resetPwdFormRules,
      handleGeneratePassword,
      handleResetPwdFormSubmit,
      resetPwdFormSubmitLoading,
      handleCancelAuthorization,
      handleToRoleDetail,
      hantoToUserGroupDetail,
      authorizeVisible,
      handleAuthorize,
      handleToResourceGroupDetail,
      handleToResourceDetail,
      handleToPermissionDetail,
      accountLocked,
      enableMfa,
      handleSetAccountStatus,
      handleSetMfaStatus,
      handleRebindMfaDevice,
      handleClearAuthorizedTokens,
      consoleAccess,
      handleSetConsoleAccessStatus,
    };
  },
});
