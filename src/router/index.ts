import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import ChapterReaderPage from '@/views/novels/ChapterReaderPage.vue';
import CreateChapterPage from '@/views/novels/CreateChapterPage.vue';
import CreateNovelPage from '@/views/novels/CreateNovelPage.vue';
import FavouritesPage from '@/views/profile/FavouritesPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import NovelsPage from '@/views/novels/NovelsPage.vue';
import NovelDetailPage from '@/views/novels/NovelDetailPage.vue';
import ProfilePage from '@/views/profile/ProfilePage.vue';
import ReadingsPage from '@/views/profile/ReadingsPage.vue';
import StatisticsPage from '@/views/StatisticsPage.vue';
import SettingsPage from '@/views/profile/SettingsPage.vue';
import NovelsLayout from '@/views/novels/NovelsLayout.vue';
import ProfileLayout from '@/views/profile/ProfileLayout.vue';
import { useAuthStore } from '@/stores/useAuthStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth:true } //Requiere autenticación
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresUnauth:true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresUnauth:true } //No requiere autenticación
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsPage,
    meta: { requiresUnauth:true }
  },
  {
    path: '/novels',
    name: 'Novels',
    component: NovelsLayout,
    children: [
      {
        path: '',
        name: 'NovelsPage',
        component: NovelsPage,
        meta: { requiresAuth:true }
      },
      {
        path: 'create',
        name: 'CreateNovel',
        component: CreateNovelPage,
        meta: { requiresAuth:true }
      },
      {
        path: ':novelId/chapters/create',
        name: 'CreateChapter',
        component: CreateChapterPage,
        meta: { requiresAuth:true }
      },
      {
        path: ':id/detail',
        name: 'NovelDetail',
        component: NovelDetailPage,
        meta: { requiresAuth:true }
      },
      {
        path: ':id/reader',
        name: 'ChapterReader',
        component: ChapterReaderPage,
        meta: { requiresAuth:true }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileLayout,
    meta: { requiresAuth:true },
    children: [
      {
        path: '',
        name: 'ProfilePage',
        component: ProfilePage
      },
      {
        path: 'favourites',
        name: 'Favourites',
        component: FavouritesPage
      },
      {
        path: 'readings',
        name: 'Readings',
        component: ReadingsPage
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Guard de Navegación Global. Controla el acceso a las rutas antes de que el usuario navegue a ellas.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isUserAuthenticated;

  // Usamos 'to.matched.some' para verificar si alguna de las rutas coincidentes (incluyendo padres) tiene la meta.
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresUnauth = to.matched.some(record => record.meta.requiresUnauth);

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario NO está autenticado
    console.log('Router Guard: Ruta protegida. Usuario no autenticado. Redirigiendo a Redister.');
    next({ name: 'Register', query: { redirect: to.fullPath } }); // Redirige a Register
  } else if (requiresUnauth && isAuthenticated) {
    // Si la ruta es para "no autenticados" (ej. Login) y el usuario SÍ está autenticado
    console.log('Router Guard: Ruta para no autenticados. Usuario ya autenticado. Redirigiendo a Home.');
    next({ name: 'Home' }); 
  } else {
    // En cualquier otro caso, permite la navegación
    next();
  }
});



export default router
