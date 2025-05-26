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
          <router-link :to="{name:'Home'}">HomePage</router-link>
          <router-link :to="{name:'Login'}">LoginPage</router-link>
          <router-link :to="{name:'Register'}">RegisterPage</router-link>
          <router-link :to="{name:'Profile'}">ProfilePage</router-link>
          <router-link :to="{name:'Novels'}">NovelsLayout</router-link>
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
  }
  a:hover{
    color: blueviolet;
  }
</style>