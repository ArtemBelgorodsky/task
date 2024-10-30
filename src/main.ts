import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import './style.css';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import KeyFilter from 'primevue/keyfilter';

const app = createApp(App);
app.directive('keyfilter', KeyFilter);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount('#app');
