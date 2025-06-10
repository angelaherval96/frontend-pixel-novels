<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Configuración del Avatar</IonTitle>
      </IonToolbar>
    </IonHeader>
    
    <IonContent :fullscreen="true" class="ion-padding">
      <div class="container">
        <h3>Elige tu Avatar</h3>

        <div class="avataresContainer">
          <div class="avatar" v-for="(avatar, index) in predefinedAvatars" :key="index" :class="{ 'selected': selectedAvatarUrl === avatar.url}" @click="selectAvatar(avatar.url)">
            <IonAvatar :src="avatar.url" :alt="avatar.name">
              <img :src="avatar.url" :alt="avatar.name" />
            </IonAvatar>
          </div>
        </div>

        <IonButton v-if="selectedAvatarUrl && selectedAvatarUrl !== authStore.user?.avatar_url" 
        expand="block" class="ion-margin-top" color="primary" @click="saveAvatar" :disabled="isSubmitting">
          <IonIcon :icon="save" slot="start"></IonIcon>
          <IonSpinner v-if="isSubmitting" name="crescent"></IonSpinner>
          <span v-else>Guardar Avatar</span> 
        </IonButton>
      </div>

    </IonContent>

  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonButton, IonIcon, IonSpinner, toastController } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { save } from 'ionicons/icons';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserService';

const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const selectedAvatarUrl = ref<string>('');

//Avatars predefinidos subidos en el storage de Laravel
const predefinedAvatars = [
  { name: 'Avatar 1', url: 'http://localhost:8000/storage/avatars/emoji.jpg' },
  { name: 'Avatar 2',  url: 'http://localhost:8000/storage/avatars/niño.jpg' },
  { name: 'Avatar 3', url: 'http://localhost:8000/storage/avatars/niña.jpg' },
  { name: 'Avatar 4', url: 'http://localhost:8000/storage/avatars/hombre1.jpg' },
  { name: 'Avatar 5', url: 'http://localhost:8000/storage/avatars/hombreMayor.jpg' }, 
  { name: 'Avatar 6', url: 'http://localhost:8000/storage/avatars/hippie.jpg' },
  { name: 'Avatar 7', url: 'http://localhost:8000/storage/avatars/logo.png' }
];

onMounted(() => {
  // Cargar el avatar actual del usuario
  if (authStore.user?.avatar_url) {
    selectedAvatarUrl.value = authStore.user.avatar_url;
  }
});

// Función que se ejecuta cuando el usuario hace clic en un avatar
const selectAvatar = (url: string) => {
  selectedAvatarUrl.value = url;
};

// Llama al servicio para guardar la nueva URL del avatar
const saveAvatar = async () => {
  if (!selectedAvatarUrl.value) {
    alert("Por favor, selecciona un avatar.");
    return;
  }
  isSubmitting.value = true;
  console.log("1. Iniciando guardado de avatar...");

  try {
    const response = await UserService.setUserAvatar(selectedAvatarUrl.value);
    console.log("2. Respuesta del API recibida:", response);
    
    if (response.success && response.data?.user) {
      // Actualiza el usuario en el store con los nuevos datos

      console.log("3. La condición de éxito es VERDADERA. Intentando actualizar el store...");
      authStore.setUser(response.data.user);
      console.log("4. El store ha sido actualizado con el nuevo usuario.");
      
      const toast = await toastController.create({
        message: '¡Avatar actualizado correctamente!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
       console.log("5. Toast de éxito mostrado.");

    } else {
      console.error("3b. La condición de éxito es FALSA. Lanzando error.");
      throw new Error(response.message || 'No se pudo actualizar el avatar.');
    }
  } catch (error: any) {
      console.error("ERROR ATRAPADO. Mensaje:", error.message, "Objeto de error:", error);
      const toast = await toastController.create({
        message: error.message || 'Ocurrió un error.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}
.avataresContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
ion-avatar {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}
</style>