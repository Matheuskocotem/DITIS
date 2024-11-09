import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import './styles/global.css'
import './styles/variables.css'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import './styles/reset.css'

const app = createApp(App);

app.use(router);
app.use(store);

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

app.mount('#app');
