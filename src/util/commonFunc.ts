import { logoutSubmit } from "@/api/logout";
import { useGlobalVariablesStore } from "@/store/globalVariables";
import router from "@/router";
import { Notification } from "@arco-design/web-vue";

/**
 * 检查控制台权限
 */
export const checkConsoleAccess = async () => {
  const globalVariables = useGlobalVariablesStore().getData();
  if (!globalVariables.consoleAccess) {
    try {
      await logoutSubmit();
    } catch (err: any) {
      Notification.error("退出登录失败");
    } finally {
      router.push({
        path: "/403",
      });
    }
  } else {
    router.push({ path: "/" });
  }
};
