<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import { getSubDomain, handleApiError, handleApiSuccess } from "./util/tool";
import { checkTenant } from "./api/tenant";
import router from "./router";

onBeforeMount(() => {
  const tenantCode = getSubDomain();
  if (tenantCode) {
    // 检查租户标识
    checkTenant(tenantCode)
      .then((result: any) => {
        handleApiSuccess(result, (data: any) => {
          if (data.exists) {
            localStorage.setItem("OAuthIssuer", data.issuer);
            localStorage.setItem("tenantCode", tenantCode);
          } else {
            // 租户不存在
            localStorage.removeItem("OAuthIssuer");
            localStorage.removeItem("tenantCode");
            router.push({
              path: "/404",
            });
          }
        });
      })
      .catch((err: any) => {
        handleApiError(err, "检查租户是否存在");
        router.push({
          path: "/404",
        });
      });
  }
});
</script>
