<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Mi Perfil</IonTitle>
        <!-- Ejemplo: botón de logout -->
            <IonButtons slot="end">
                <IonButton>
                    <IonIcon :icon="logOutOutline" />
                </IonButton>
            </IonButtons>
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
/* Estilos específicos del perfil */
</style>
