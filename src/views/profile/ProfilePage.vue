<template>
  <IonContent :fullscreen="true" class="ion-padding">
    <div v-if="user" class="container">
      <IonCard class="card">
        <IonItem lines="none" class="avatarItem">
          <IonAvatar slot="start" class="avatar">
            <img src="" alt="Foto de perfil">
          </IonAvatar>
          <IonLabel>
            <h2><strong>{{ user.name }}</strong></h2>
            <p>{{ user.role }}</p>
          </IonLabel>
        </IonItem>

        <IonCardContent>
          <IonList>
            <IonItem lines="full">
              <IonLabel position="stacked">Nombre de Usuario</IonLabel>
              <div class="itemContent"> {{ user.name }} </div>
            </IonItem>

            <IonItem lines="full">
              <IonLabel position="stacked">Correo Electrónico</IonLabel>
              <div class="itemContent"> {{ user.email }} </div>
            </IonItem>

          </IonList>
        </IonCardContent>
      </IonCard>
    </div>
    <div v-else class="loading">
      <IonSpinner name="crescent"></IonSpinner>
      <p>Cargando perfil...</p>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import { IonContent, IonCard, IonItem, IonAvatar, IonLabel, IonCardContent, IonList, IonSpinner } from '@ionic/vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { computed, onMounted } from 'vue';
import { IUser } from '@/interfaces/IUser';

const authStore = useAuthStore();

//Se utiliza una propiedad computada para acceder al usuario y asgurar reactividad.
const user = computed<IUser | null>(() => authStore.currentUser);

//Para asegurar que los datos se carguen si no están
onMounted(() => {
  if (authStore.isAuthenticated && !authStore.currentUser){
    authStore.fetchUser();
  }
})
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}
.card{
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}
.avatarItem{
  --inner-padding-end: 0;
  --padding-start: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  align-items: center;
}
.avatar{
  width: 80px;
  height: 80px;
  margin-right: 16px;
  border: 3px solid var(--ion-color-primary);
}
.avatar img{
  border-radius: 50%;
}
ion-label{
  color: var(--ion-color-medium-shade);
}
.item-content {
  padding-top: 8px; 
  color: var(--ion-color-text);
}
.loading{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
</style>