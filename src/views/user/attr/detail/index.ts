import { defineComponent, onMounted, reactive, ref } from "vue";
import router from "@/router";
import { getUserAttrDetail, updateUserAttr } from "@/api/user";
import { handleApiError, handleApiSuccess } from "@/util/tool";
import { useRoute } from "vue-router";
import { Notification } from "@arco-design/web-vue";

/**
 * 返回上一级
 */
const handleBack = () => {
  router.back();
};

const userColumnId = ref("");
const userColumnName = ref("");

/** 用户字段信息表单 */
const userColumnInfoFormRef = ref();
const userColumnInfoForm = reactive({
  id: undefined,
  name: undefined,
  key: undefined,
  dataType: undefined,
  extFlg: undefined,
  userLstDisplay: undefined,
  displayWidth: undefined,
});
const userColumnInfoFormRules = {
  key: [{ required: true, message: "字段 key 未填写" }],
  name: [{ required: true, message: "字段名称未填写" }],
  dataType: [{ required: true, message: "表单类型未选择" }],
  extFlg: [{ required: true, message: "字段类型未选择" }],
  userLstDisplay: [{ required: true, message: "是否在用户列表显示未选择" }],
};

/**
 * 获取用户字段详情
 *
 * @param id 用户字段id
 */
const handleGetUserColumnDetail = (id: string) => {
  getUserAttrDetail(id).then((result: any) => {
    handleApiSuccess(result, (data: any) => {
      userColumnId.value = data.id;
      userColumnName.value = data.name;

      userColumnInfoForm.id = data.id;
      userColumnInfoForm.name = data.name;
      userColumnInfoForm.key = data.key;
      userColumnInfoForm.dataType = data.dataType;
      userColumnInfoForm.extFlg = data.extFlg;
      userColumnInfoForm.userLstDisplay = data.userLstDisplay;
      userColumnInfoForm.displayWidth = data.displayWidth;
    });
  });
};

/**
 * 重置用户字段信息表单
 */
const handleResetUserColumnInfoForm = () => {
  userColumnInfoFormRef.value.resetFields();
  handleGetUserColumnDetail(userColumnId.value);
};

/**
 * 提交用户字段信息表单
 */
const handleUserColumnInfoFormSubmit = () => {
  updateUserAttr(userColumnInfoForm)
    .then((result: any) => {
      handleApiSuccess(result, () => {
        Notification.success("保存成功");
        handleGetUserColumnDetail(userColumnId.value);
      });
    })
    .catch((err: any) => {
      handleApiError(err, "更新用户字段");
    });
};

export default defineComponent({
  setup() {
    onMounted(() => {
      const route = useRoute();
      const userColumnId = route.query.id as string;

      handleGetUserColumnDetail(userColumnId);
    });

    return {
      handleBack,
      userColumnId,
      userColumnName,
      userColumnInfoFormRef,
      userColumnInfoForm,
      userColumnInfoFormRules,
      handleResetUserColumnInfoForm,
      handleUserColumnInfoFormSubmit,
    };
  },
});
