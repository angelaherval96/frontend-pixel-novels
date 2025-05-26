<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Gestión de Novelas</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <router-view />
    </IonContent>
  </IonPage>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
</script>

<style scoped>
/* Estilos opcionales */
</style>
