import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import { SampleDataService } from "./services/sample-data-service";


Vue.use(PiniaVuePlugin);

(() => {
    const dataService = SampleDataService.getInstance();
    console.log(`sources = ${dataService.getSources().length}`);
    console.log(`articles = ${dataService.getArticles().length}`);
})();






new Vue({
    router,
    pinia: createPinia(),
    render: (h) => h(App),
}).$mount("#app");
