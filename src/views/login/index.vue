<script lang="ts">
import loginTs from "./index";
export default loginTs;
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

<template>
  <div class="login-container">
    <div class="form-container" v-if="!toMfa && !toFogotPwd">
      <div class="title">统一身份认证</div>
      <a-tabs>
        <a-tab-pane key="1" title="密码登录">
          <a-form
            size="large"
            :model="passwordLoginForm"
            :rules="passwordLoginRules"
            @submit-success="handlePasswordLoginFromSubmit"
          >
            <a-form-item field="username" hide-label>
              <a-input
                v-model="passwordLoginForm.username"
                placeholder="请输入手机号 / 邮箱 / 用户名"
              >
                <template #prefix>
                  <icon-user />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item field="password" hide-label>
              <a-input-password
                v-model="passwordLoginForm.password"
                placeholder="请输入登录密码"
              >
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item hide-label>
              <a-button
                html-type="submit"
                type="primary"
                class="login-btn"
                :loading="loginLoading"
                >登 录</a-button
              >
            </a-form-item>
          </a-form>
          <a-link @click="handleToForgotPwd">忘记密码</a-link>
        </a-tab-pane>
        <a-tab-pane key="2" title="邮箱登录">
          <a-form
            ref="emailLoginFormRef"
            size="large"
            :model="emailLoginForm"
            :rules="emailLoginFormRules"
            @submit-success="handleEmailLoginFormSubmit"
          >
            <a-form-item field="email" hide-label>
              <a-input v-model="emailLoginForm.email" placeholder="请输入邮箱">
                <template #prefix>
                  <icon-user />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item field="code" hide-label>
              <a-row style="width: 100%">
                <a-col :span="16">
                  <a-input
                    v-model="emailLoginForm.code"
                    placeholder="请输入验证码"
                  >
                    <template #prefix>
                      <icon-safe />
                    </template>
                  </a-input>
                </a-col>
                <a-col :span="8">
                  <a-button
                    style="width: 110px; margin-left: 20px"
                    type="outline"
                    :disabled="sendEmailCodeDisable"
                    @click="handleSendEmailCode"
                    >{{ sendEmailCodeBtnText }}</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item hide-label>
              <a-button html-type="submit" type="primary" class="login-btn"
                >登 录</a-button
              >
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="form-container" v-if="toMfa && !toBind && !toFogotPwd">
      <div>
        <a-button type="text" size="mini" @click="backToLogin">
          返回登录
          <template #icon>
            <icon-left />
          </template>
        </a-button>
        <div class="title">MFA认证</div>
        <div class="mfa-info">请输入 6 位动态安全码，进行多因素认证</div>
        <div class="mfa-code">
          <a-verification-code
            size="large"
            v-model="totpValidForm.code"
            style="width: 300px"
            @finish="handleTotpValidSubmit"
          />
        </div>
      </div>
    </div>
    <div class="form-container" v-if="toMfa && toBind && !toFogotPwd">
      <div>
        <a-button type="text" size="mini" @click="backToLogin">
          返回登录
          <template #icon>
            <icon-left />
          </template>
        </a-button>
        <div class="title">MFA认证</div>
        <div class="mfa-info">请扫描二维码，添加安全码</div>
        <div class="mfa-code">
          <div>
            <img :src="qrCodeData" />
          </div>
          <a-button type="text" style="width: 180px" @click="toBind = false"
            >我已添加</a-button
          >
        </div>
      </div>
      <a-divider orientation="center">
        <span class="mfa-info">下载验证器</span>
      </a-divider>
      <div class="app-download-container">
        <a-popover position="lb">
          <a-button type="text" size="mini"
            >Microsoft Authenticator - iOS</a-button
          >
          <template #content>
            <a-qrcode
              value="https://apps.apple.com/cn/app/id983156458"
              :bordered="false"
            ></a-qrcode>
          </template>
        </a-popover>
        <a-popover position="lb">
          <a-button type="text" size="mini"
            >Microsoft Authenticator - Android</a-button
          >
          <template #content>
            <a-qrcode
              value="https://www.lenovomm.com/appdetail/com.azure.authenticator/20197724"
              :bordered="false"
            ></a-qrcode>
          </template>
        </a-popover>
      </div>
    </div>
    <div class="form-container" v-if="toFogotPwd">
      <div class="forgot-pwd-container" v-if="toCheckForgotPwdCode">
        <div class="forgot-pwd-title">重置密码</div>
        <div class="forgot-pwd-info">
          请输入你注册的邮箱用于接收验证码，将为你重置密码。
        </div>
        <a-form
          ref="checkForgotPwdCodeFormRef"
          size="large"
          :model="checkForgotPwdCodeForm"
          :rules="checkForgotPwdCodeFormRules"
          @submit-success="handleCheckForgotPwdCodeFormSubmit"
        >
          <a-form-item field="username" hide-label>
            <a-input
              v-model="checkForgotPwdCodeForm.username"
              placeholder="请输入邮箱"
            >
              <template #prefix>
                <icon-user />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item field="code" hide-label>
            <a-row style="width: 100%">
              <a-col :span="16">
                <a-input
                  v-model="checkForgotPwdCodeForm.code"
                  placeholder="请输入验证码"
                >
                  <template #prefix>
                    <icon-safe />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="8">
                <a-button
                  style="width: 110px; margin-left: 20px"
                  type="outline"
                  :disabled="sendForgotPwdEmailCodeDisable"
                  @click="handleSendForgotPwdEmailCode"
                  >{{ sendForgotPwdEmailCodeBtnText }}</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item hide-label>
            <a-button html-type="submit" type="primary" class="login-btn"
              >下一步</a-button
            >
          </a-form-item>
        </a-form>
        <div class="backup">
          <a-link size="mini" @click="handleBackupToLogin">返回</a-link>
        </div>
      </div>
      <div class="forgot-pwd-container" v-if="toResetPwd">
        <div class="forgot-pwd-title">重置密码</div>
        <div class="forgot-pwd-info">
          {{ `你正在重试 ${resetPwdForm.username} 的密码。` }}
        </div>
        <a-form
          ref="resetPwdFormRef"
          size="large"
          :model="resetPwdForm"
          :rules="resetPwdFormRules"
          @submit-success="handleResetPwdFormSubmit"
        >
          <a-form-item field="newPwd" label="新密码" hide-label>
            <a-input-password
              v-model="resetPwdForm.newPwd"
              placeholder="请输入新密码"
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item field="confirmPwd" label="确认密码" hide-label>
            <a-input-password
              v-model="resetPwdForm.confirmPwd"
              placeholder="请确认密码"
            >
              <template #prefix>
                <icon-lock />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item hide-label>
            <a-button html-type="submit" type="primary" class="login-btn"
              >重置密码</a-button
            >
          </a-form-item>
        </a-form>
        <div class="backup">
          <a-link size="mini" @click="handleBackToForgotPwd">返回</a-link>
        </div>
      </div>
    </div>
  </div>
</template>
