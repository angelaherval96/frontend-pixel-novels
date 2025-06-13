<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonButton :router-link="{name: 'Home'}">Volver</IonButton>
          <IonButton routerLink="/novels">Lista de Novelas</IonButton> 
          <IonButton :router-link="{name: 'Favourites'}">Favoritas</IonButton>
          <IonButton :router-link="{name: 'Readings'}">Historial de Lecturas</IonButton>
        </IonButtons>

        <ion-searchbar :value="searchInput" @ionInput="onSearchInput" show-clear-button="always" :clear-icon="trashBin" placeholder="Buscar novelas..."></ion-searchbar>
      </IonToolbar>
      </IonHeader>
    
      <router-view :key="$route.fullPath"/>
   
  </IonPage>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonSearchbar } from '@ionic/vue';
import { trashBin } from 'ionicons/icons';
import { useSearchState } from '@/composables/useSearchState'; 

const { searchInput, setSearchInput } = useSearchState();

// Escucha el evento ionInput y actualiza el estado global
const onSearchInput = (event) => {
  // Al escribir en el buscador, cambia el estado global de búsqueda
  setSearchInput(event.detail.value);
  console.log('NovelLayout - Actualizando estado global con:', event.detail.value);
};

</script>

<style scoped>

</style>
