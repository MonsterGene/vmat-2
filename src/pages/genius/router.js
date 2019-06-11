const genius_router = [
  {
    path: '/genius/login',
    meta: {
      breadcrumb: true,
      // public: true,
      theme: 'purple'
    },
    name: 'genius/login',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/login.vue`
    )
  },
  {
    path: '/genius/manage',
    meta: {
      breadcrumb: false,
      theme: 'purple'
    },
    name: 'genius/manage',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/manage.vue`
    )
  },
  {
    path: '/genius/logs/:connection',
    meta: {
      breadcrumb: false,
      theme: 'purple'
    },
    name: 'genius/logs',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/logs.vue`
    )
  },
  {
    path: '/genius',
    meta: {
      breadcrumb: false,
      theme: 'purple',
    },
    name: 'genius',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/station.vue`
    )
  },
  {
    path: '/genius/:container',
    meta: {
      breadcrumb: false,
      theme: 'purple'
    },
    name: 'genius/station',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/container.vue`
    )
  },
  {
    path: '/genius/:container/:connection',
    meta: {
      breadcrumb: false,
      theme: 'purple'
    },
    name: 'genius/container',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/connection.vue`
    )
  },
  {
    path: '/xterm',
    meta: {
      breadcrumb: false,
      theme: 'purple'
    },
    name: 'genius/xterm',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/xterm.vue`
    )
  },
];

export default genius_router;
