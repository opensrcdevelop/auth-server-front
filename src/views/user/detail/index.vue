<script lang="ts">
import detailTs from "./index";
export default detailTs;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<template>
  <div>
    <page-header @back="handleBack">
      <div class="detail-header">
        <div>
          <div class="title-container">
            <a-space>
              <span class="title">{{ username }}</span>
              <a-tag color="red" v-if="accountLocked">禁用</a-tag>
              <a-tag color="arcoblue" v-if="!accountLocked">正常</a-tag>
              <a-tag color="arcoblue" v-if="enableMfa">已启用 MFA</a-tag>
              <a-tag color="red" v-if="!enableMfa">未启用 MFA</a-tag>
              <a-tag color="arcoblue" v-if="consoleAccess"
                >允许访问控制台</a-tag
              >
              <a-tag color="red" v-if="!consoleAccess">禁止访问控制台</a-tag>
            </a-space>
          </div>
          <div class="id">
            <span>ID:</span>
            <copy-text :text="userId" textColor="#86909c" />
          </div>
        </div>
        <a-space>
          <a-dropdown :popup-max-height="false">
            <a-button>更多</a-button>
            <template #content>
              <a-doption
                style="color: #545968"
                v-if="!accountLocked"
                @click="handleSetAccountStatus(true)"
              >
                <icon-stop />
                <span style="margin-left: 8px">禁用账号</span>
              </a-doption>
              <a-doption style="color: #545968" v-if="accountLocked">
                <icon-check-circle />
                <span
                  style="margin-left: 8px"
                  @click="handleSetAccountStatus(false)"
                  >启用账号</span
                >
              </a-doption>
              <a-doption
                style="color: #545968"
                v-if="enableMfa"
                @click="handleRebindMfaDevice"
              >
                <icon-refresh />
                <span style="margin-left: 8px">重新绑定 MFA 设备</span>
              </a-doption>
              <a-doption style="color: #545968" v-if="!enableMfa">
                <icon-check-circle />
                <span style="margin-left: 8px" @click="handleSetMfaStatus(true)"
                  >开启 MFA</span
                >
              </a-doption>
              <a-doption style="color: #545968" v-if="enableMfa">
                <icon-poweroff />
                <span
                  style="margin-left: 8px"
                  @click="handleSetMfaStatus(false)"
                  >关闭 MFA</span
                >
              </a-doption>
              <a-doption style="color: #545968" v-if="!consoleAccess">
                <icon-check-circle />
                <span
                  style="margin-left: 8px"
                  @click="handleSetConsoleAccessStatus(true)"
                  >开启控制台访问</span
                >
              </a-doption>
              <a-doption style="color: #545968" v-if="consoleAccess">
                <icon-stop />
                <span
                  style="margin-left: 8px"
                  @click="handleSetConsoleAccessStatus(false)"
                  >禁止访问控制台</span
                >
              </a-doption>
              <a-doption style="color: #545968">
                <icon-eraser />
                <span
                  style="margin-left: 8px"
                  @click="handleClearAuthorizedTokens"
                  >清除授权的 Token</span
                >
              </a-doption>
            </template>
          </a-dropdown>
          <a-button type="primary" @click="handleOpenResetPwdModal"
            >重置密码</a-button
          >
        </a-space>
      </div>
      <a-tabs
        :active-key="activeTab"
        @change="handleTabChange"
      >
        <a-tab-pane key="user_info" title="用户信息">
          <div class="tab-container">
            <div class="info-title">账号信息</div>
            <a-form :model="accountInfoForm" layout="vertical">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item field="cerateTime" label="创建时间">
                    <a-input v-model="accountInfoForm.createTime" readonly />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="lastLoginTime" label="最后登录时间">
                    <a-input v-model="accountInfoForm.lastLoginTime" readonly />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="lastLoginIp" label="最后登录 IP">
                    <a-input v-model="accountInfoForm.lastLoginIp" readonly />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="lastLoginDeviceType"
                    label="最后登录设备类型"
                  >
                    <a-input
                      v-model="accountInfoForm.lastLoginDeviceType"
                      readonly
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    field="lastLoginDeviceOs"
                    label="最后登录设备 OS"
                  >
                    <a-input
                      v-model="accountInfoForm.lastLoginDeviceOs"
                      readonly
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <div class="info-title">个人信息</div>
            <a-form
              :model="userInfoForm"
              layout="vertical"
              @submit-success="handleUserInfoFormSubmit"
              ref="userInfoFormRef"
            >
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item field="username" label="用户名">
                    <a-input
                      v-model="userInfoForm.username"
                      placeholder="请输入用户名"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="phoneNumber" label="手机号">
                    <a-input
                      v-model="userInfoForm.phoneNumber"
                      placeholder="请输入手机号"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="emailAddress" label="邮箱">
                    <a-input
                      v-model="userInfoForm.emailAddress"
                      placeholder="请输入邮箱"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item hide-label>
                <a-space>
                  <a-button type="primary" html-type="submit">保存</a-button>
                  <a-button @click="handleResetUserInfoForm">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
            <div class="info-title">扩展信息</div>
            <a-form
              :model="allUserExtAttrs"
              layout="vertical"
              @submit-success="handleUserAttrsSubmit"
            >
              <a-row :gutter="24">
                <a-col
                  :span="8"
                  v-for="(attr, index) in allUserExtAttrs"
                  :key="attr.key"
                >
                  <a-form-item :label="attr.name">
                    <a-input-number
                      v-if="attr.dataType === 'NUMBER'"
                      hide-button
                      v-model="userAttrValues[index]"
                      allowClear
                    />
                    <a-input
                      v-if="attr.dataType === 'STRING'"
                      v-model="userAttrValues[index]"
                      allowClear
                    />
                    <a-select
                      v-if="attr.dataType === 'BOOLEAN'"
                      v-model="userAttrValues[index]"
                      allowClear
                    >
                      <a-option :value="true">是</a-option>
                      <a-option :value="false">否</a-option>
                    </a-select>
                    <a-date-picker
                      style="width: 100%"
                      v-if="attr.dataType === 'DATETIME'"
                      show-time
                      value-format="timestamp"
                      v-model="userAttrValues[index]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item hide-label>
                <a-space>
                  <a-button type="primary" html-type="submit">保存</a-button>
                  <a-button @click="handleResetUserAttrs">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
        <a-tab-pane key="user_belong" title="用户归属">
          <div class="tab-container">
            <div class="info-title">用户角色</div>
            <div class="add-container">
              <a-button type="text" @click="handleOpenAddUserRoleModal">
                <template #icon>
                  <icon-plus />
                </template>
                添加角色
              </a-button>
            </div>
            <a-table
              :data="userRoles"
              :bordered="false"
              :pagination="false"
              style="margin-bottom: 32px"
            >
              <template #columns>
                <a-table-column dataIndex="name" title="角色名称">
                  <template #cell="{ record }">
                    <span
                      class="table-column-name"
                      @click="handleToRoleDetail(record)"
                      >{{ record.name }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column dataIndex="code" title="角色标识">
                  <template #cell="{ record }">
                    {{ record.code }}
                  </template>
                </a-table-column>
                <a-table-column dataIndex="code" title="角色主体">
                  <template #cell="{ record }">
                    {{ record.principal }}
                  </template>
                </a-table-column>
                <a-table-column dataIndex="code" title="主体类型">
                  <template #cell="{ record }">
                    <span>{{ record.principalType }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="操作" :width="60">
                  <template #cell="{ record }">
                    <a-dropdown>
                      <a-button type="text">
                        <template #icon>
                          <icon-more />
                        </template>
                      </a-button>
                      <template #content>
                        <a-doption
                          @click="handleRemoveUserRole(record)"
                          :disabled="record.principalType === '用户组'"
                          style="color: #e8353e"
                        >
                          <template #icon>
                            <icon-undo />
                          </template>
                          撤销角色</a-doption
                        >
                      </template>
                    </a-dropdown>
                  </template>
                </a-table-column>
              </template>
            </a-table>
            <div class="info-title">所属用户组</div>
            <div class="add-container">
              <a-button type="text" @click="handleOpenAddUserGroupModal">
                <template #icon>
                  <icon-plus />
                </template>
                添加用户组
              </a-button>
            </div>
            <a-table :data="userGroups" :bordered="false" :pagination="false">
              <template #columns>
                <a-table-column dataIndex="name" title="用户组名称">
                  <template #cell="{ record }">
                    <span
                      class="table-column-name"
                      @click="hantoToUserGroupDetail(record)"
                      >{{ record.name }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column dataIndex="code" title="用户组标识">
                  <template #cell="{ record }">
                    <span>{{ record.code }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="操作" :width="60">
                  <template #cell="{ record }">
                    <a-dropdown>
                      <a-button type="text">
                        <template #icon>
                          <icon-more />
                        </template>
                      </a-button>
                      <template #content>
                        <a-doption
                          @click="handleRemoveUserGroup(record)"
                          style="color: #e8353e"
                        >
                          <template #icon>
                            <icon-undo />
                          </template>
                          移除此分组</a-doption
                        >
                      </template>
                    </a-dropdown>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="permission_management" title="权限管理">
          <div class="tab-container">
            <div class="info-title">权限授权</div>
            <div class="add-container">
              <a-button type="text" @click="handleAuthorize">
                <template #icon>
                  <icon-plus />
                </template>
                授权
              </a-button>
            </div>
            <a-table
              :data="permissions"
              :bordered="false"
              :pagination="false"
              :expandable="{ width: 30 }"
              row-key="authorizeId"
            >
              <template #columns>
                <a-table-column
                  title="被授权主体"
                  :sortable="{
                    sortDirections: ['ascend', 'descend'],
                  }"
                >
                  <template #cell="{ record }">
                    <a-tag color="arcoblue">{{ record.principal }}</a-tag>
                  </template>
                </a-table-column>
                <a-table-column
                  title="主体类型"
                  :sortable="{
                    sortDirections: ['ascend', 'descend'],
                  }"
                >
                  <template #cell="{ record }">
                    {{ record.principalTypeDisplayName }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="资源组"
                  :sortable="{
                    sortDirections: ['ascend', 'descend'],
                  }"
                >
                  <template #cell="{ record }">
                    <span
                      class="table-column-name"
                      @click="
                        handleToResourceGroupDetail(record.resourceGroupId)
                      "
                      >{{ record.resourceGroupName }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column
                  title="资源"
                  :sortable="{
                    sortDirections: ['ascend', 'descend'],
                  }"
                >
                  <template #cell="{ record }">
                    <span
                      class="table-column-name"
                      @click="handleToResourceDetail(record.resourceId)"
                      >{{ record.resourceName }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column
                  title="权限名称"
                  :sortable="{
                    sortDirections: ['ascend', 'descend'],
                  }"
                >
                  <template #cell="{ record }">
                    <span
                      class="table-column-name"
                      @click="handleToPermissionDetail(record.permissionId)"
                      >{{ record.permissionName }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column
                  title="权限标识"
                  :sortable="{
                    sortDirections: ['ascend', 'descend'],
                  }"
                >
                  <template #cell="{ record }">
                    {{ record.permissionCode }}
                  </template>
                </a-table-column>
                <a-table-column title="操作">
                  <template #cell="{ record }">
                    <a-dropdown>
                      <a-button type="text">
                        <template #icon>
                          <icon-more />
                        </template>
                      </a-button>
                      <template #content>
                        <a-doption
                          :disabled="record.principalType !== 'USER'"
                          style="color: #e8353e"
                          @click="handleCancelAuthorization(record)"
                        >
                          <template #icon>
                            <icon-undo />
                          </template>
                          取消授权</a-doption
                        >
                      </template>
                    </a-dropdown>
                  </template>
                </a-table-column>
              </template>
              <template #expand-row="{ record }">
                <div class="condition-container">
                  <div v-if="record.conditions.length > 0">限制条件</div>
                  <div v-else>无限制条件</div>
                  <div v-if="record.conditions.length > 0">
                    <a-descriptions
                      style="margin-top: 12px"
                      v-for="(condition, index) in record.conditions"
                      :key="index"
                      :column="1"
                      bordered
                    >
                      <a-descriptions-item label="限制条件名称">
                        {{ condition.name }}
                      </a-descriptions-item>
                      <a-descriptions-item label="SpringEL 表达式">
                        {{ condition.expression }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </div>
                </div>
              </template>
              <template #expand-icon="{ expanded }">
                <icon-right v-if="!expanded" />
                <icon-down v-if="expanded" />
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </page-header>

    <!-- 添加用户角色对话框 -->
    <a-modal
      :visible="addUserRoleModalVisible"
      @cancel="handleCloseAddUserRoleModal"
      :footer="false"
      :width="680"
    >
      <template #title>用户角色</template>
      <a-form
        :model="addUserRoleForm"
        :rules="addUserRoleFormRules"
        ref="addUserRoleFormRef"
        @submit-success="handleAddUserRoleFormSubmit"
      >
        <a-form-item field="roleIds" label="角色">
          <a-select
            v-model:model-value="addUserRoleForm.roleIds"
            v-model:input-value="roleSearchKeyword"
            @search="handleSearchRole"
            @clear="handleSearchRole"
            :filter-option="false"
            @dropdown-reach-bottom="loadMoreRole"
            multiple
            allow-clear
            placeholder="请选择角色"
          >
            <a-option v-for="role in roleList" :key="role.id" :value="role.id">
              {{ role.name }} - {{ role.code }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <div class="add-user-role-btn-container">
            <a-space>
              <a-button @click="handleCloseAddUserRoleModal">取消</a-button>
              <a-button
                type="primary"
                html-type="submit"
                :loading="addUserRoleFormSubmitLoading"
                >保存</a-button
              >
            </a-space>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加用户组对话框 -->
    <a-modal
      :visible="addUserGroupModalVisible"
      @cancel="handleCloseAddUserGroupModal"
      :footer="false"
      :width="680"
    >
      <template #title>所属用户组</template>
      <a-form
        :model="addUserGroupForm"
        :rules="addUserGroupFormRules"
        ref="addUserGroupFormRef"
        @submit-success="handleAddUserGroupFormSubmit"
      >
        <a-form-item field="userGroupIds" label="用户组">
          <a-select
            v-model:model-value="addUserGroupForm.userGroupIds"
            v-model:input-value="userGroupSearchKeyword"
            @search="handleSearchUserGroup"
            @clear="handleSearchUserGroup"
            :filter-option="false"
            @dropdown-reach-bottom="loadMoreUserGroup"
            multiple
            allow-clear
          >
            <a-option
              v-for="group in userGroupList"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }} - {{ group.code }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <div class="add-user-group-btn-container">
            <a-space>
              <a-button @click="handleCloseAddUserGroupModal">取消</a-button>
              <a-button
                type="primary"
                html-type="submit"
                :loading="addUserGroupFormSubmitLoading"
                >保存</a-button
              >
            </a-space>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 重置密码对话框 -->
    <a-modal
      :visible="resetPwdModalVisible"
      @cancel="handleCloseResetPwdModal"
      :footer="false"
    >
      <template #title>重置密码</template>
      <a-form
        :model="resetPwdForm"
        :rules="resetPwdFormRules"
        ref="resetPwdFormRef"
        layout="vertical"
        @submit-success="handleResetPwdFormSubmit"
      >
        <a-form-item field="password" label="密码">
          <a-input-group style="width: 100%">
            <a-input-password
              v-model="resetPwdForm.password"
              placeholder="请输入密码"
            />
            <a-button @click="handleGeneratePassword">生成密码</a-button>
          </a-input-group>
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item field="sendEmail" label="发送重置后的密码通知用户">
              <a-switch v-model="resetPwdForm.sendEmail" type="round" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="needChangePwd" label="强制用户登录后修改密码">
              <a-switch v-model="resetPwdForm.needChangePwd" type="round" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          v-if="resetPwdForm.sendEmail && !resetPwdForm.rawEmail"
          field="emailAddress"
          label="邮箱"
        >
          <a-input
            v-model="resetPwdForm.emailAddress"
            placeholder="请输入邮箱地址"
          />
        </a-form-item>
        <a-form-item hide-label>
          <div class="reset-pwd-btn-container">
            <a-space>
              <a-button @click="handleCloseResetPwdModal">取消</a-button>
              <a-button
                type="primary"
                html-type="submit"
                :loading="resetPwdFormSubmitLoading"
                >确定</a-button
              >
            </a-space>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <authorize :visible="authorizeVisible" @close="authorizeVisible = false" />
  </div>
</template>
