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

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsPage
  },
  {
    path: '/novels',
    name: 'Novels',
    component: NovelsLayout,
    children: [
      {
        path: '',
        component: NovelsPage
      },
      {
        path: 'create',
        name: 'CreateNovel',
        component: CreateNovelPage
      },
      {
        path: ':novelId/chapters/create',
        name: 'CreateChapter',
        component: CreateChapterPage
      },
      {
        path: ':id/detail',
        name: 'NovelDetail',
        component: NovelDetailPage
      },
      {
        path: ':id/reader',
        name: 'ChapterReader',
        component: ChapterReaderPage
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileLayout,
    children: [
      {
        path: '',
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
})

export default router
