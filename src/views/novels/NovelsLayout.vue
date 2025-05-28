<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Gestión de Novelas</IonTitle>
      </IonToolbar>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonButton routerLink="/novels">Lista de Novelas</IonButton> 
          <IonButton routerLink="/novels/create">Crear Novela</IonButton>
          <IonButton routerLink="/novels/favourites">Favoritas</IonButton>
        </IonButtons>

        <ion-searchbar show-clear-button="always" :clear-icon="trashBin" value="Buscar novelas"></ion-searchbar>
      </IonToolbar>
      </IonHeader>
    <IonContent>
      <router-view/>
    </IonContent>
  </IonPage>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonSearchbar } from '@ionic/vue';
import { trashBin } from 'ionicons/icons';
</script>

<style scoped>

</style>
