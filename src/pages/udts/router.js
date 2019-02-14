const udts_router = [
  {
    path: '/udts',
    meta: {
      breadcrumb: false,
      theme: 'purple'
    },
    name: 'udts',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/udts/pages/udts.vue`
    )
  },
];
  
export default udts_router;