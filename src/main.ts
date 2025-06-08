import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

import { createPinia } from 'pinia';
import {useAuthStore} from './stores/useAuthStore';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

// Swiper styles
import 'swiper/css';
import {register} from 'swiper/element/bundle';
register(); // Registra los elementos de Swiper para que funcionen en Vue


const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(createPinia()); //Para que use Pinia


//Crea una instancia del store de autenticación y se llama a la función init (para comprobar si ya hay token guardado), después se monta la app.
const authStore = useAuthStore();
authStore.init().then(() => {
  router.isReady().then(() => {
    app.mount('#app');
  });
});
