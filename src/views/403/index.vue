<template>
  <div class="container">
    <a-result
      status="403"
      title="403 Forbidden"
      subtitle="没有权限访问，请联系管理员。"
    >
    </a-result>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
