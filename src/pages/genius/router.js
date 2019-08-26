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
    path: '/genius/logout',
    meta: {
      breadcrumb: true,
      // public: true,
      theme: 'purple'
    },
    name: 'genius/logout',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/logout.vue`
    )
  },
  {
    path: '/genius/manage',
    meta: {
      breadcrumb: false,
      theme: 'purple',
      requireAuth: true,
    },
    name: 'genius/manage',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/manage.vue`
    )
  },
  {
    path: '/genius',
    meta: {
      breadcrumb: false,
      theme: 'purple',
      requireAuth: true,
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
      theme: 'purple',
      requireAuth: true,
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
      theme: 'purple',
      requireAuth: true,
    },
    name: 'genius/container',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/genius/pages/connection.vue`
    )
  },
];

export default genius_router;
