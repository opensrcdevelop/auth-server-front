import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

/** 菜单路由 */
export const menuRoutes: RouteRecordRaw[] = [
  {
    path: "/client",
    component: () => import("@/views/client/index.vue"),
    meta: {
      title: "客户端",
      icon: "icon-app",
    },
  },
  {
    path: "/user",
    meta: {
      title: "用户管理",
      icon: "icon-user",
    },
    children: [
      {
        path: "/user/list",
        component: () => import("@/views/user/index.vue"),
        meta: {
          title: "用户列表",
        },
      },
      {
        path: "/user/group",
        component: () => import("@/views/user/group/index.vue"),
        meta: {
          title: "用户组管理",
        },
      },
      {
        path: "/user/attr",
        component: () => import("@/views/user/attr/index.vue"),
        meta: {
          title: "字段管理",
        },
      },
    ],
  },
  {
    path: "/resource",
    meta: {
      title: "资源管理",
      icon: "icon-resource",
    },
    children: [
      {
        path: "/resource/group",
        component: () => import("@/views/resource/group/index.vue"),
        meta: {
          title: "资源组管理",
        },
      },
    ],
  },
  {
    path: "/permission",
    meta: {
      title: "权限管理",
      icon: "icon-permission",
    },
    children: [
      {
        path: "/permission/resource",
        component: () => import("@/views/permission/resource/index.vue"),
        meta: {
          title: "资源权限",
        },
      },
      {
        path: "/role",
        component: () => import("@/views/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        path: "/permission/expression",
        component: () => import("@/views/permission/expression/index.vue"),
        meta: {
          title: "限制条件",
        },
      },
    ],
  },
  {
    path: "/tenant",
    component: () => import("@/views/tenant/index.vue"),
    meta: {
      title: "多租户",
      icon: "icon-tenant",
    },
  },
];

/** 页面路由 */
const pageRoutes: RouteRecordRaw[] = [
  {
    path: "/client/detail",
    component: () => import("@/views/client/detail/index.vue"),
    meta: {
      parent: "/client",
      title: "客户端详情",
    },
  },
  {
    path: "/client/create",
    component: () => import("@/views/client/create/index.vue"),
    meta: {
      parent: "/client",
      title: "创建客户端",
    },
  },
  {
    path: "/user/detail",
    component: () => import("@/views/user/detail/index.vue"),
    meta: {
      parent: "/user/list",
      title: "用户详情",
    },
  },
  {
    path: "/user/create",
    component: () => import("@/views/user/create/index.vue"),
    meta: {
      parent: "/user/list",
      title: "创建用户",
    },
  },
  {
    path: "/user/group/detail",
    component: () => import("@/views/user/group/detail/index.vue"),
    meta: {
      parent: "/user/group",
      title: "用户组详情",
    },
  },
  {
    path: "/user/group/create",
    component: () => import("@/views/user/group/create/index.vue"),
    meta: {
      parent: "/user/group",
      title: "创建用户组",
    },
  },
  {
    path: "/role/detail",
    component: () => import("@/views/role/detail/index.vue"),
    meta: {
      parent: "/role",
      title: "角色详情",
    },
  },
  {
    path: "/role/create",
    component: () => import("@/views/role/create/index.vue"),
    meta: {
      parent: "/role",
      title: "创建角色",
    },
  },
  {
    path: "/permission/resource/detail",
    component: () => import("@/views/permission/resource/detail/index.vue"),
    meta: {
      parent: "/permission/resource",
      title: "资源详情",
    },
  },
  {
    path: "/permission/detail",
    component: () => import("@/views/permission/detail/index.vue"),
    meta: {
      parent: "/permission/resource",
      title: "权限详情",
    },
  },
  {
    path: "/permission/resource/create",
    component: () => import("@/views/permission/resource/create/index.vue"),
    meta: {
      parent: "/permission/resource",
      title: "创建资源",
    },
  },
  {
    path: "/permission/create",
    component: () => import("@/views/permission/create/index.vue"),
    meta: {
      parent: "/permission/resource",
      title: "创建权限",
    },
  },
  {
    path: "/permission/expression/detail",
    component: () => import("@/views/permission/expression/detail/index.vue"),
    meta: {
      parent: "/permission/expression",
      title: "限制条件详情",
    },
  },
  {
    path: "/permission/expression/create",
    component: () => import("@/views/permission/expression/create/index.vue"),
    meta: {
      parent: "/permission/expression",
      title: "创建限制条件",
    },
  },
  {
    path: "/permission/authorize",
    component: () => import("@/views/permission/authorize/index.vue"),
    meta: {
      parent: "/permission/resource",
      title: "授权",
    },
  },
  {
    path: "/resource/group/detail",
    component: () => import("@/views/resource/group/detail/index.vue"),
    meta: {
      parent: "/resource/group",
      title: "资源组详情",
    },
  },
  {
    path: "/resource/group/create",
    component: () => import("@/views/resource/group/create/index.vue"),
    meta: {
      parent: "/resource/group",
      title: "创建资源组",
    },
  },
  {
    path: "/user/attr/create",
    component: () => import("@/views/user/attr/create/index.vue"),
    meta: {
      parent: "/user/attr",
      title: "创建用户字段",
    },
  },
  {
    path: "/user/attr/detail",
    component: () => import("@/views/user/attr/detail/index.vue"),
    meta: {
      parent: "/user/attr",
      title: "用户字段详情",
    },
  },
  {
    path: "/tenant/detail",
    component: () => import("@/views/tenant/detail/index.vue"),
    meta: {
      parent: "/tenant",
      title: "租户详情",
    },
  },
  {
    path: "/tenant/create",
    component: () => import("@/views/tenant/create/index.vue"),
    meta: {
      parent: "/tenant",
      title: "创建租户",
    },
  },
];

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/client",
    children: [...menuRoutes, ...pageRoutes],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/oauth2/redirect",
    component: () => import("@/views/oauth2/index.vue"),
  },
  {
    path: "/login/changePwd",
    component: () => import("@/views/login/changePwd/index.vue"),
  },
  {
    path: "/403",
    component: () => import("@/views/403/index.vue"),
  },
  {
    path: "/404",
    component: () => import("@/views/404/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

/**
 * 前置路由拦截
 */
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem("accessToken")) {
    if (
      to.path === "/oauth2/redirect" ||
      to.path === "/login" ||
      to.path === "/login/changePwd" ||
      to.path === "/403" ||
      to.path === "/404"
    ) {
      next();
    } else {
      router.push("/oauth2/redirect");
    }
  } else {
    next();
  }
});

export default router;
