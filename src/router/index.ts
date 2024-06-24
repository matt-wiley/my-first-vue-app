import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import DevTools from "../views/DevTools.vue";

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
      component: DevTools
    }
  ],
});

export default router;
