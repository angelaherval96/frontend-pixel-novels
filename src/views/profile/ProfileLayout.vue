<template>
  <IonPage>
    <IonHeader>
      <!-- <IonToolbar>
        <IonTitle>Perfil de {{ authStore.currentUser?.name || '' }}</IonTitle>
      </IonToolbar> -->
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonButton :router-link="{name: 'Home'}">Volver</IonButton>
          <IonButton routerLink="/profile">Mi perfil</IonButton> 
          <IonButton routerLink="/profile/favourites">Favoritos</IonButton>
          <IonButton routerLink="/profile/readings">Historial de Lectura</IonButton>
          <IonButton routerLink="/profile/settings">Configuración</IonButton>
          <IonButton @click="closeSesion">Cerrar Sesión</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    
      <router-view :key="$route.fullPath"/>
   
  </IonPage>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton} from '@ionic/vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const closeSesion = async () =>{

  await authStore.logout();
  router.push({ name: 'Login'});
}
</script>

<style scoped>

</style>

