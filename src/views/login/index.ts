import { Notification } from "@arco-design/web-vue";
import { reactive, ref, defineComponent, onMounted } from "vue";
import { getQueryString, handleApiError, handleApiSuccess } from "@/util/tool";
import {
  loginSubmit,
  totpValidSubmit,
  sendEmailCodeSubmit,
  emailLoginSubmit,
  checkCode,
  resetPwd,
} from "@/api/login";
import { logoutSubmit } from "@/api/logout";
import router from "@/router";

/** 租户名称 */
const tenantName = ref(undefined);

const passwordLoginForm = reactive({
  username: undefined,
  password: undefined,
});

const passwordLoginRules = {
  username: [
    {
      required: true,
      message: "账号未填写",
    },
  ],
  password: [
    {
      required: true,
      message: "密码未填写",
    },
  ],
};

const toMfa = ref(false);
const toBind = ref(false);
const qrCodeData = ref("");

const totpValidForm = reactive({
  code: "",
});

const loginLoading = ref(false);
const mfaValidLoading = ref(false);

/**
 * 返回登录页
 */
const backToLogin = () => {
  logoutSubmit()
    .then((result: any) => {
      handleApiSuccess(result, () => {
        toMfa.value = false;
        passwordLoginForm.password = "";
        passwordLoginForm.username = "";
        totpValidForm.code = "";
      });
    })
    .catch((err: any) => {
      Notification.error(`返回登录页失败: ${err.message}`);
    });
};

/**
 * 提交密码登录表单
 *
 * @param formData 表单数据
 */
const handlePasswordLoginFromSubmit = (formData) => {
  loginLoading.value = true;
  loginSubmit(formData)
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        handleLoginResult(data, "password");
      });
    })
    .catch((err: any) => {
      handleApiError(err, "登录");
    })
    .finally(() => {
      loginLoading.value = false;
    });
};

/**
 * Totp 安全动态码验证
 *
 * @param code
 */
const handleTotpValidSubmit = (code) => {
  mfaValidLoading.value = true;
  totpValidSubmit(totpValidForm)
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        if (data.valid) {
          toTarget();
        } else {
          Notification.warning("安全码错误，请重新输入");
        }
      });
    })
    .catch((err: any) => {
      handleApiError(err, "MFA认证");
    })
    .finally(() => {
      mfaValidLoading.value = false;
    });
};

/**
 * 跳转至目标路径
 */
async function toTarget() {
  let target = getQueryString("target");
  if (target) {
    window.location.href = target;
  } else {
    router.push({
      path: "/",
    });
  }
}

const emailLoginFormRef = ref();
const emailLoginForm = reactive({
  email: undefined,
  code: undefined,
});
const emailLoginFormRules = reactive({
  email: [
    {
      required: true,
      message: "邮箱未填写",
    },
  ],
  code: [
    {
      required: true,
      message: "验证码未填写",
    },
  ],
});

const sendEmailCodeDisable = ref(false);
const sendEmailCodeBtnText = ref("发送验证码");
let remainingTime = 60;
let sendEmailCodeTimer;

/**
 * 发送邮箱验证码
 */
const handleSendEmailCode = () => {
  if (!sendEmailCodeDisable.value) {
    emailLoginFormRef.value.validateField("email", (err) => {
      if (!err) {
        sendEmailCodeSubmit(emailLoginForm.email)
          .then((result: any) => {
            handleApiSuccess(result, () => {
              // 60s 倒计时
              sendEmailCodeDisable.value = true;
              sendEmailCodeBtnText.value = `${remainingTime}s`;
              sendEmailCodeTimer = setInterval(() => {
                remainingTime--;
                sendEmailCodeBtnText.value = `${remainingTime}s`;
                if (remainingTime < 0) {
                  clearInterval(sendEmailCodeTimer);
                  sendEmailCodeDisable.value = false;
                  sendEmailCodeBtnText.value = "发送验证码";
                  remainingTime = 60;
                }
              }, 1000);
            });
          })
          .catch((err: any) => {
            handleApiError(err, "发送验证码");
          });
      }
    });
  }
};

/**
 * 提交邮箱登录表单
 *
 * @param formData 邮箱登录表单
 */
const handleEmailLoginFormSubmit = (formData) => {
  loginLoading.value = true;
  emailLoginSubmit(formData)
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        handleLoginResult(data, "email");
      });
    })
    .catch((err: any) => {
      handleApiError(err, "登录");
    })
    .finally(() => {
      loginLoading.value = false;
    });
};

/**
 * 处理登录结果
 *
 * @param result 登录结果
 */
const handleLoginResult = (result: any, loginType: string) => {
  // 需要修改密码
  if (result.needChangePwd) {
    router.push({
      path: "/login/changePwd",
    });
    return;
  }

  if (result.enableMfa) {
    // 进入多因素认证
    toMfa.value = true;
    toBind.value = !result.bound;
    if (result.qrCode) {
      qrCodeData.value = result.qrCode;
    }
  } else {
    toTarget();
  }
};

/** 忘记密码 */
const toFogotPwd = ref(false);
const toCheckForgotPwdCode = ref(false);

/**
 * 跳转到忘记密码
 */
const handleToForgotPwd = () => {
  toFogotPwd.value = true;
  toCheckForgotPwdCode.value = true;
  toResetPwd.value = false;
};

/** 检查忘记密码的邮箱验证码 */
const checkForgotPwdCodeFormRef = ref();
const checkForgotPwdCodeForm = reactive({
  username: undefined,
  code: undefined,
});
const checkForgotPwdCodeFormRules = reactive({
  username: [
    {
      required: true,
      message: "邮箱未填写",
    },
  ],
  code: [
    {
      required: true,
      message: "验证码未填写",
    },
  ],
});

const sendForgotPwdEmailCodeDisable = ref(false);
const sendForgotPwdEmailCodeBtnText = ref("发送验证码");
let forgotPwdRemainingTime = 60;
let sendForgotPwdEmailCodeTimer;

/**
 * 发送忘记密码的邮箱验证码
 */
const handleSendForgotPwdEmailCode = () => {
  if (!sendForgotPwdEmailCodeDisable.value) {
    checkForgotPwdCodeFormRef.value.validateField("username", (err) => {
      if (!err) {
        sendEmailCodeSubmit(checkForgotPwdCodeForm.username)
          .then((result: any) => {
            handleApiSuccess(result, () => {
              // 60s 倒计时
              sendForgotPwdEmailCodeDisable.value = true;
              sendForgotPwdEmailCodeBtnText.value = `${forgotPwdRemainingTime}s`;
              sendForgotPwdEmailCodeTimer = setInterval(() => {
                forgotPwdRemainingTime--;
                sendForgotPwdEmailCodeBtnText.value = `${forgotPwdRemainingTime}s`;
                if (forgotPwdRemainingTime < 0) {
                  clearInterval(sendForgotPwdEmailCodeTimer);
                  sendForgotPwdEmailCodeDisable.value = false;
                  sendForgotPwdEmailCodeBtnText.value = "发送验证码";
                  forgotPwdRemainingTime = 60;
                }
              }, 1000);
            });
          })
          .catch((err: any) => {
            handleApiError(err, "发送验证码");
          });
      }
    });
  }
};

/**
 * 提交检查忘记密码的邮箱验证码表单
 */
const handleCheckForgotPwdCodeFormSubmit = (formData: any) => {
  checkCode(formData)
    .then((result: any) => {
      handleApiSuccess(result, (data: any) => {
        resetPwdForm.username = formData.username;
        resetPwdForm.resetPwdToken = data.resultToken;
        checkForgotPwdCodeFormRef.value.resetFields();

        // 跳转重置密码页面
        toCheckForgotPwdCode.value = false;
        toResetPwd.value = true;
      });
    })
    .catch((err: any) => {
      handleApiError(err, "校验验证码");
    });
};

/**
 * 返回登录页面
 */
const handleBackupToLogin = () => {
  checkForgotPwdCodeFormRef.value.resetFields();

  toCheckForgotPwdCode.value = false;
  toResetPwd.value = false;
  toFogotPwd.value = false;
};

/** 重置密码 */
const toResetPwd = ref(false);

/** 重置密码表单 */
const resetPwdFormRef = ref();
const resetPwdForm = reactive({
  username: undefined,
  newPwd: undefined,
  confirmPwd: undefined,
  resetPwdToken: undefined,
});
const resetPwdFormRules = {
  newPwd: [{ required: true, message: "新密码未填写" }],
  confirmPwd: [
    { required: true, message: "确认新密码未填写" },
    {
      validator: (value, cb) => {
        if (value !== resetPwdForm.newPwd) {
          cb("两次输入的密码不一致");
        } else {
          cb();
        }
      },
    },
  ],
};

/**
 * 提交重置密码表单
 */
const handleResetPwdFormSubmit = (formData: any) => {
  delete formData.confirmPwd;
  delete formData.username;

  resetPwd(formData)
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("重置密码成功");
        resetPwdFormRef.value.resetFields();

        // 返回登录页
        toFogotPwd.value = false;
        toCheckForgotPwdCode.value = false;
        toResetPwd.value = false;
      });
    })
    .catch((err: any) => {
      handleApiError(err, "重置密码");
    });
};

/**
 * 返回忘记密码页面
 */
const handleBackToForgotPwd = () => {
  resetPwdFormRef.value.resetFields();
  toResetPwd.value = false;
  toCheckForgotPwdCode.value = true;
};

export default defineComponent({
  setup() {
    onMounted(() => {
      tenantName.value = localStorage.getItem("tenantName");
    });

    return {
      tenantName,
      passwordLoginForm,
      passwordLoginRules,
      toMfa,
      toBind,
      qrCodeData,
      totpValidForm,
      backToLogin,
      handlePasswordLoginFromSubmit,
      handleTotpValidSubmit,
      emailLoginFormRef,
      emailLoginForm,
      emailLoginFormRules,
      handleSendEmailCode,
      handleEmailLoginFormSubmit,
      sendEmailCodeDisable,
      sendEmailCodeBtnText,
      loginLoading,
      toFogotPwd,
      toCheckForgotPwdCode,
      handleToForgotPwd,
      checkForgotPwdCodeFormRef,
      checkForgotPwdCodeForm,
      checkForgotPwdCodeFormRules,
      sendForgotPwdEmailCodeDisable,
      sendForgotPwdEmailCodeBtnText,
      handleSendForgotPwdEmailCode,
      handleBackupToLogin,
      handleCheckForgotPwdCodeFormSubmit,
      toResetPwd,
      resetPwdFormRef,
      resetPwdForm,
      resetPwdFormRules,
      handleResetPwdFormSubmit,
      handleBackToForgotPwd,
      mfaValidLoading,
    };
  },
});
