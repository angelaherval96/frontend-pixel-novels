<template>
  <ion-app>
      <ion-menu content-id="main-content">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Pixel Novels</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div id="rutas">
          <router-link :to="{name:'Home'}">Inicio</router-link>
          <router-link :to="{name:'Login'}">Login</router-link>
          <router-link :to="{name:'Register'}">Registro</router-link>
          <router-link :to="{name:'Profile'}">Perfil</router-link>
          <router-link :to="{name:'Novels'}">Novelas</router-link>
          <router-link :to="{name:'Statistics'}">Estadísticas</router-link>
          <router-link :to="{name:'Settings'}">Configuración</router-link>

          <!-- Enlace condicional para que solo se muestre si el usuario es administrador o creador: -->
           <router-link :to="{name:'Dashboard'}" v-if="authStore.isAuthenticated && (authStore.user?.role === 'admin' || authStore.user?.role === 'creator')">Dashboard</router-link>
        </div>
      </ion-content>
    </ion-menu>
    <ion-page id="main-content">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Pixel Novels</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding"> 
        <ion-router-outlet />
      </ion-content>
      <FooterBar/>
    </ion-page>
  </ion-app>
  
</template>

<script lang="ts" setup>
  import { IonApp, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonRouterOutlet } from '@ionic/vue';
  import FooterBar from './components/FooterBar.vue';
  import { useAuthStore } from '@/stores/useAuthStore';

  const authStore = useAuthStore();
  
  
</script>

<style scoped>
  #rutas{
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  a{
    text-decoration: none;
    color: rgb(0, 110, 255);
    padding: 8px 0;
  }
  a:hover{
    color: blueviolet;
  }
</style>