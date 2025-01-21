import "./assets/css/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./assets/css/tailwind.css";
import icon from "@/components/common/svgIcon.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("svg-icon", icon);

app.mount("#app");
