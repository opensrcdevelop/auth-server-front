<script lang="ts">
import userTs from "./index";
export default userTs;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<template>
  <div>
    <div class="user-header">
      <div class="left">
        <div class="title">用户列表</div>
        <div class="info">对用户进行统一管理。</div>
      </div>
      <a-button type="primary" @click="handleToCreateUser">创建用户</a-button>
    </div>
    <div class="user-list">
      <div class="user-operation">
        <a-space>
          <a-input-search
            :style="{ width: '320px' }"
            placeholder="输入用户名进行搜索"
            allow-clear
            v-model="userSerachKeyword"
            @search="handleSearchUser(userSerachKeyword)"
            @keyup.enter.native="handleSearchUser(userSerachKeyword)"
            @clear="handleSearchUserClear"
          />
          <a-trigger trigger="click" :popup-offset="8">
            <a-button>
              <template #icon>
                <icon-filter />
              </template>
            </a-button>
            <template #content>
              <div class="user-filter-container">
                <a-form
                  :model="userListFilters"
                  @submit-success="handleFilterUser"
                  ref="userListFiltersRef"
                >
                  <a-row
                    :gutter="8"
                    v-for="(filter, index) in userListFilters.filters"
                    :key="index"
                  >
                    <a-col :span="8">
                      <a-form-item
                        :field="`filters[${index}].key`"
                        hide-label
                        :rules="[{ required: true, message: '字段未选择' }]"
                      >
                        <a-select
                          style="width: 180px"
                          placeholder="请选择字段"
                          v-model:model-value="filter.key"
                          @change="handleUserColumnsSelectChange"
                          allow-search
                        >
                          <a-option
                            v-for="column in allUserColumnsForFilter"
                            :key="column.key"
                            :value="column.key"
                          >
                            {{ column.name }}</a-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item
                        :field="`filters[${index}].filterType`"
                        hide-label
                        :rules="[{ required: true, message: '运算符未选择' }]"
                      >
                        <a-select
                          placeholder="请选择运算符"
                          v-model:model-value="filter.filterType"
                        >
                          <a-option
                            value="EQ"
                            v-if="
                              [
                                'STRING',
                                'NUMBER',
                                'BOOLEAN',
                                'DATETIME',
                              ].includes(filter.dataType)
                            "
                            >等于</a-option
                          >
                          <a-option
                            value="NE"
                            v-if="
                              [
                                'STRING',
                                'NUMBER',
                                'BOOLEAN',
                                'DATETIME',
                              ].includes(filter.dataType)
                            "
                            >不等于</a-option
                          >
                          <a-option
                            value="LIKE"
                            v-if="['STRING'].includes(filter.dataType)"
                            >包含</a-option
                          >
                          <a-option
                            value="NOT_LIKE"
                            v-if="['STRING'].includes(filter.dataType)"
                            >不包含</a-option
                          >
                          <a-option
                            value="GT"
                            v-if="
                              ['NUMBERE', 'DATETIME'].includes(filter.dataType)
                            "
                            >大于</a-option
                          >
                          <a-option
                            value="LT"
                            v-if="
                              ['NUMBERE', 'DATETIME'].includes(filter.dataType)
                            "
                            >小于</a-option
                          >
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8">
                      <a-form-item
                        :field="`filters[${index}].value`"
                        hide-label
                        :rules="[{ required: true, message: '未输入 / 选择' }]"
                      >
                        <a-input-number
                          v-if="filter.dataType === 'NUMBER'"
                          hide-button
                          v-model="filter.value"
                          placeholder="请输入"
                        />
                        <a-input
                          v-if="filter.dataType === 'STRING'"
                          v-model="filter.value"
                          placeholder="请输入"
                        />
                        <a-select
                          v-if="filter.dataType === 'BOOLEAN'"
                          v-model="filter.value"
                          placeholder="请选择"
                        >
                          <a-option value="true">是</a-option>
                          <a-option value="false">否</a-option>
                        </a-select>
                        <a-date-picker
                          v-if="filter.dataType === 'DATETIME'"
                          show-time
                          value-format="timestamp"
                          v-model="filter.value"
                        />
                        <icon-minus-circle
                          class="remove-filter"
                          v-if="userListFilters.filters.length > 1"
                          @click="handleRemoveUserListFilter(index)"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-form-item hide-label>
                    <div class="operation-container">
                      <a-button type="text" @click="handleAddUserListFilter">
                        <template #icon>
                          <icon-plus-circle />
                        </template>
                        添加筛选条件
                      </a-button>
                      <a-space>
                        <a-button @click="handleResetFilterUser">重置</a-button>
                        <a-button type="primary" html-type="submit"
                          >搜索</a-button
                        >
                      </a-space>
                    </div>
                  </a-form-item>
                </a-form>
              </div>
            </template>
          </a-trigger>
          <a-trigger trigger="click" :popup-offset="8">
            <a-button>
              <template #icon>
                <icon-settings />
              </template>
            </a-button>
            <template #content>
              <a-spin :loading="sortableColumnsLoading">
                <div class="soartable-column-container">
                  <div
                    class="soartable-column-item"
                    v-for="(column, index) in sortableColumns"
                  >
                    <div
                      :style="{
                        cursor:
                          column.key !== 'username' ? 'move' : 'not-allowed',
                      }"
                      :draggable="column.key !== 'username'"
                      @dragstart="handleDragStart($event, index)"
                      @dragenter="handleDragEnter($event, index)"
                      @dragover="handleDragOver"
                      @dragend="handleDragEnd"
                    >
                      <icon-lock
                        v-if="column.key === 'username'"
                        class="left-icon"
                      />
                      <icon-drag-dot-vertical
                        v-if="column.key !== 'username'"
                        class="left-icon"
                      />
                      {{ column.name }}
                    </div>
                    <div class="remove-icon-container">
                      <icon-minus-circle
                        class="remove-icon"
                        @click.stop="handleUnDisplayUserAttr(column)"
                        v-if="column.key !== 'username'"
                      />
                    </div>
                  </div>
                  <a-trigger
                    trigger="click"
                    position="right"
                    :popup-offset="12"
                  >
                    <a-button class="soartable-column-add-btn">
                      <template #icon>
                        <icon-plus />
                      </template>
                      <template #default>添加字段</template>
                    </a-button>
                    <template #content>
                      <a-spin :loading="selectableColumnsLoading">
                        <div class="soartable-column-add-container">
                          <a-input-search
                            class="search"
                            placeholder="搜索字段"
                            allow-clear
                            v-model="selectableColumnSearchKeyword"
                            @search="handleSearchAllUserAttrs"
                            @keyup.enter.native="handleSearchAllUserAttrs"
                            @Clear="handleSearchAllUserAttrs"
                          />
                          <div
                            class="soartable-column-add-dropdown"
                            ref="selectableColumnsContainerRef"
                            @scroll="loadMoreAllUserAttrs"
                          >
                            <div
                              v-for="(column, index) in selectableColumns"
                              :key="column.key"
                            >
                              <div
                                v-if="!column.userLstDisplay"
                                class="selectable-column-item"
                                @click="handleDisplayUserAttr(column)"
                              >
                                {{ column.name }}
                              </div>
                              <div
                                v-if="column.userLstDisplay"
                                class="display-column"
                              >
                                <span>{{ column.name }}</span>
                                <icon-check />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a-spin>
                    </template>
                  </a-trigger>
                </div>
              </a-spin>
            </template>
          </a-trigger>
        </a-space>
      </div>
      <a-table
        :bordered="false"
        :data="userList"
        :pagination="userListPagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        :scroll="{ y: '100%' }"
        style="margin-bottom: 32px"
      >
        <template #columns>
          <a-table-column
            v-for="(column, index) in tableColumns"
            :key="column.key"
            :title="column.name"
            :data-index="column.key"
            :width="column.displayWidth || 180"
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
          >
            <template #cell="{ record }">
              <span
                v-if="
                  record[column.key] !== undefined && column.key === 'username'
                "
                class="table-column-username"
                @click="handleToUserDetail(record)"
              >
                {{ record[column.key] }}
              </span>
              <span
                v-if="
                  record[column.key] !== undefined &&
                  column.key !== 'username' &&
                  column.dataType !== 'BOOLEAN'
                "
              >
                {{ record[column.key] }}
              </span>
              <span
                v-if="
                  record[column.key] !== undefined &&
                  column.key !== 'username' &&
                  column.dataType === 'BOOLEAN'
                "
              >
                {{
                  record[column.key] && record[column.key] === true
                    ? "是"
                    : "否"
                }}
              </span>
              <span v-if="record[column.key] === undefined">-</span>
            </template>
          </a-table-column>
          <a-table-column title="操作" fixed="right" :width="60">
            <template #cell="{ record }">
              <a-dropdown>
                <a-button type="text">
                  <template #icon>
                    <icon-more />
                  </template>
                </a-button>
                <template #content>
                  <a-doption
                    @click="handleRemoveUserAccount(record)"
                    style="color: #e8353e"
                  >
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除账户</a-doption
                  >
                </template>
              </a-dropdown>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>
