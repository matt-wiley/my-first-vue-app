import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import DevToolsView from "../views/DevToolsView.vue";
import ContentStoreView from "../views/ContentStoreView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "AppView",
      component: HomeView,
    },
    {
      path: "/devtools",
      name: "DevTools",
      component: DevToolsView,
    },
    {
      path: "/contentStore",
      name: "ContentStore",
      component: ContentStoreView
    }
  ],
});

export default router;
