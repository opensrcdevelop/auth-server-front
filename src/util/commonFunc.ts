import { logoutSubmit } from "@/api/logout";
import { useGlobalVariablesStore } from "@/store/globalVariables";
import { handleApiSuccess } from "./tool";
import router from "@/router";
import { Notification } from "@arco-design/web-vue";

/**
 * 检查控制台权限
 */
export const checkConsoleAccess = () => {
  const globalVariables = useGlobalVariablesStore().getData();
  if (!globalVariables.consoleAccess) {
    logoutSubmit()
      .then((result: any) => {
        handleApiSuccess(result, () => {
          localStorage.removeItem("accessToken");
          router.push({
            path: "/403",
          });
        });
      })
      .catch((err: any) => {
        Notification.error(`退出登录失败: ${err.message}`);
        router.push({
          path: "/403",
        });
      });
  }
};
