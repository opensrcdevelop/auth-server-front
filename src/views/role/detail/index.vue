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
        <span class="title">{{ roleName }}</span>
        <div class="id">
          <span>ID:</span>
          <copy-text :text="roleId" textColor="#86909c" />
        </div>
      </div>

      <a-tabs :active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="role_info" title="角色信息">
          <div class="tab-container">
            <div class="info-title">基本信息</div>
            <a-form
              :model="roleInfoForm"
              :rules="roleInfoFormRules"
              ref="roleInfoFormRef"
              layout="vertical"
              @submit-success="handleRoleInfoFormSubmit"
            >
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item field="name" label="角色名称">
                    <a-input
                      v-model="roleInfoForm.name"
                      placeholder="请输入角色名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="code" label="角色标识">
                    <a-input
                      v-model="roleInfoForm.code"
                      placeholder="请输入用户组标识"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item field="desc" label="角色描述">
                <a-textarea
                  v-model="roleInfoForm.desc"
                  placeholder="请输入角色描述"
                  :auto-size="{
                    minRows: 3,
                    maxRows: 5,
                  }"
                />
              </a-form-item>
              <a-form-item hide-label>
                <a-space>
                  <a-button type="primary" html-type="submit">保存</a-button>
                  <a-button @click="handleResetRoleInfoForm">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
            <div class="info-title">角色主体</div>
            <a-input-search
              :style="{ width: '320px' }"
              placeholder="输入用户名 / 用户组名进行搜索"
              allow-clear
              v-model="searchRolePrincipalKeyword"
              @search="handleSearchRolePrincipal"
              @clear="handleSearchRolePrincipal"
              @keyup.enter.native="handleSearchRolePrincipal"
            />
            <div class="add-container">
              <a-button type="text" @click="handleOpenAddRolePrincipalModel">
                <template #icon>
                  <icon-plus />
                </template>
                添加主体
              </a-button>
            </div>
            <a-table
              :data="rolePrincipals"
              :pagination="rolePrincipalsPagination"
              :bordered="false"
              :scroll="{ y: '100%' }"
              @page-size-change="handlePageSizeChange"
              @page-change="handlePageChange"
            >
              <template #columns>
                <a-table-column title="主体名称">
                  <template #cell="{ record }">
                    <span
                      class="table-column-name"
                      @click="handleToPrincipalDetail(record)"
                      >{{ record.principal }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column title="主体类型">
                  <template #cell="{ record }">
                    {{ record.principalTypeDisplayName }}
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
                          style="color: #e8353e"
                          @click="handleRemoveRolePrincipal(record)"
                        >
                          <template #icon>
                            <icon-undo />
                          </template>
                          移除</a-doption
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
              row-key="permissionId"
            >
              <template #columns>
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
                    >
                      {{ record.resourceName }}
                    </span>
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
                    >
                      {{ record.permissionName }}
                    </span>
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

    <!-- 添加角色主体对话框 -->
    <a-modal
      :visible="addRolePrincipalModelVisible"
      :footer="false"
      :width="728"
      @cancel="handleCloseAddRolePrincipalModel"
    >
      <template #title>添加角色主体</template>
      <div class="select-principal-container">
        <div class="select-principal-source">
          <a-tabs v-model="activePrincipalTabKey">
            <a-tab-pane key="1" title="用户">
              <a-input-search
                class="search"
                placeholder="输入用户名进行搜索"
                allow-clear
                v-model="searchSelectUserKeyword"
                @search="handleSearchUser"
                @keyup.enter.native="handleSearchUser"
              />
              <div class="check-all-container" v-if="allUsers.length > 0">
                <a-checkbox
                  style="width: 100%"
                  :model-value="selectUserCheckAll"
                  :indeterminate="selectUserIndeterminate"
                  @change="handleChangeSelectUserCheckAll"
                  >全选</a-checkbox
                >
              </div>
              <div class="empty-container" v-if="allUsers.length === 0">
                <a-empty />
              </div>
              <div
                class="scroll-container"
                v-else
                ref="allUsersContainerRef"
                @scroll="handleAllUsersContainerScroll"
              >
                <a-checkbox-group
                  direction="vertical"
                  style="width: 100%"
                  v-model="addRolePrincipalsForm.userIds"
                  @change="handleSelectUserChange"
                >
                  <div
                    class="select-user-item"
                    v-for="(user, index) in allUsers"
                  >
                    <a-checkbox
                      :key="index"
                      :value="user.userId"
                      style="width: 100%"
                    >
                      {{ user.username }}
                    </a-checkbox>
                  </div>
                </a-checkbox-group>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" title="用户组">
              <a-input-search
                class="search"
                placeholder="输入用户组名或标识进行搜索"
                allow-clear
                v-model="searchSelectUserGroupKeyword"
                @search="handleSearchUserGroup"
                @keyup.enter.native="handleSearchUserGroup"
                @clear="handleSearchUserGroup"
              />
              <div class="check-all-container" v-if="allUserGroups.length > 0">
                <a-checkbox
                  style="width: 100%"
                  :model-value="selectUserGroupCheckAll"
                  :indeterminate="selectUserGroupIndeterminate"
                  @change="handleChangeSelectUserGroupCheckAll"
                  >全选</a-checkbox
                >
              </div>
              <div class="empty-container" v-if="allUserGroups.length === 0">
                <a-empty />
              </div>
              <div
                class="scroll-container"
                v-else
                ref="allUserGroupsContainerRef"
                @scroll="handleAllUserGroupsContainerScroll"
              >
                <a-checkbox-group
                  direction="vertical"
                  style="width: 100%"
                  v-model="addRolePrincipalsForm.userGroupIds"
                  @change="handleSelectUserGroupChange"
                >
                  <div
                    class="select-userGroup-item"
                    v-for="(userGroup, index) in allUserGroups"
                  >
                    <a-checkbox
                      :key="index"
                      :value="userGroup.id"
                      style="width: 100%"
                    >
                      {{ userGroup.name }}
                    </a-checkbox>
                  </div>
                </a-checkbox-group>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="select-principal-result">
          <div class="select-principal-result-title">
            <span>已选：{{ selectedPrincipals.length }} 个主体</span>
            <a-button
              type="text"
              size="mini"
              @click="handleClearSelctedPrincipals"
              >清空</a-button
            >
          </div>
          <a-empty v-if="selectedPrincipals.length === 0" />
          <div class="scroll-container" v-else>
            <div
              class="selected-principal-item"
              v-for="(principal, index) in selectedPrincipals"
              :key="index"
            >
              <div>
                {{ principal.username ? principal.username : principal.name }}
              </div>
              <div
                class="remove-container"
                @click="handleRemoveSelectedPrincipal(principal)"
              >
                <icon-close />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-container">
        <a-space>
          <a-button @click="handleCloseAddRolePrincipalModel">取消</a-button>
          <a-button
            type="primary"
            @click="handleAddRolePrincipalsFormSubmit"
            :loading="addRolePrincipalsFormSubmitLoading"
            >确定</a-button
          >
        </a-space>
      </div>
    </a-modal>

    <authorize :visible="authorizeVisible" @close="authorizeVisible = false" />
  </div>
</template>
