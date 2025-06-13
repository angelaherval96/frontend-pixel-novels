<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Gestión de Usuarios</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" class="ion-padding">
      
      <div v-if="isLoading">
        <IonSpinner name="crescent"></IonSpinner>
        <p class="ion-text-center">Cargando...</p>
      </div>

      <div v-if="error && !isLoading" class="ion-text-center ion-padding">
        <IonIcon :icon="alertCircleOutline" color="danger"></IonIcon>
        <p>Error al cargar los usuarios: {{ error }}</p>
        <IonButton @click="loadUsers">Reintentar</IonButton>
      </div>

      <IonList v-if="!isLoading && users.length > 0">
        <IonListHeader>
          <IonLabel>Usuario</IonLabel>
          <IonLabel>Email</IonLabel>
          <IonLabel>Rol</IonLabel>
        </IonListHeader>

        <IonItemSliding v-for="user in users" :key="user.id">
          <IonItem>
            <IonAvatar slot="start">
              <IonImg :src="user.avatar_url || 'http://localhost:8000/storage/avatars/niño.png'" alt="Avatar de usuario"></IonImg>
            </IonAvatar>

            <IonLabel>
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
              <p>Rol: {{ user.role }}</p>
            </IonLabel>

            <IonChip :color="getRoleColor(user.role)" slot="end">
              <IonLabel>{{ user.role }}</IonLabel>
            </IonChip>
          </IonItem>

          <IonItemOptions side="end">
            <IonItemOption v-if="authStore.user?.id !== user.id" color="danger" @click="confirmDeleteUser(user.id, user.name)">
              <IonIcon :icon="trashOutline"></IonIcon>
              Eliminar
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      </IonList>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonIcon, IonButton, IonList, IonListHeader, IonLabel, IonItemSliding, IonAvatar, IonImg, IonChip, IonItemOptions, IonItemOption, IonItem, alertController, toastController } from '@ionic/vue';
import { alertCircleOutline, trashOutline} from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import UserService from '@/services/UserService';
import { IUser } from '@/interfaces/IUser';

const authStore = useAuthStore();
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const users = ref<IUser[]>([]);

//Función para cargar los usuarios
const loadUsers = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await UserService.getAllUsers();
    if (response.success && response.data?.users) {
      users.value = response.data.users;
    } else {
      error.value = 'No se encontraron usuarios.';
    }
  } catch (error:any) {
    error.value = 'No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.';
  } finally {
    isLoading.value = false;
  }
};

//Confirma la eliminación de un usuario
const confirmDeleteUser = async (userId: number, userName: string) => {
  const alert = await alertController.create({
    header: 'Confirmar Eliminación',
    message: `¿Estás seguro de que deseas eliminar al usuario ${userName}?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel'},
      { text: 'Eliminar', handler: () => deleteUser(userId)},
    ],
  });
  await alert.present();
};

//Función para eliminar un usuario
const deleteUser = async (userId: number) => {
  try {
    const response = await UserService.deleteUser(userId.toString());
    if (response.success) {
      users.value = users.value.filter(user => user.id !== userId);
      const toast = await toastController.create({
        message: 'Usuario eliminado correctamente.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } else {
      throw new Error(response.message || 'No se pudo eliminar el usuario.');
    }
  } catch (error:any) {
    const toast = await toastController.create({
      message: error.message || 'Error al eliminar el usuario.',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
};

//Función para obtener el color del chip según el rol del usuario
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'danger';
    case 'creator':
      return 'success';
    default:
      return 'primary';
  }
};

// Cargar los usuarios al montar el componente
onMounted(() => {
  loadUsers();
});
</script>
