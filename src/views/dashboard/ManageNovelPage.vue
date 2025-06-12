<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonTitle>Gestionar Novelas</IonTitle>
        
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" class="ion-padding">
      <div class="ion-padding-top ion-margin-top containerButton">
          <IonButton router-link="/dashboard/novel/create" color="medium" expand="block">
            <IonIcon slot="icon-only" :icon="addCircleOutline"></IonIcon>
            Crear Nueva
          </IonButton>
      </div>

      <div v-if="isLoading" class="ion-text-center ion-padding-top">
        <IonSpinner name="crescent"></IonSpinner>
      </div>

      <div v-if="error && !isLoading" class="ion-text-center ion-padding">
        <IonIcon :icon="alertCircleOutline" color="danger" style="font-size: 3em;"></IonIcon>
        <p>Error: {{ error }}</p>
        <IonButton @click="loadManagedNovels">Reintentar</IonButton>
      </div>

      <div v-if="!isLoading && managedNovels.length === 0 && !error" class="empty-state">
        <IonIcon :icon="bookOutline" class="empty-icon"></IonIcon>
        <h3>No has creado ninguna novela</h3>
        <p>¡Empieza a crear tu primera historia ahora mismo!</p>
        <IonButton router-link="/dashboard/novel/create">Crear mi primera novela</IonButton>
      </div>

      <IonList v-if="!isLoading && managedNovels.length > 0">
        <IonCard v-for="novel in managedNovels" :key="novel.id" class="novel-card">
          <IonImg :src="novel.cover"></IonImg>
          <IonCardHeader>
            <IonCardTitle>{{ novel.title }}</IonCardTitle>
            <IonCardSubtitle v-if="authStore.user?.role === 'admin'">
              Creador: {{ novel.creator?.name || 'N/A' }}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <div class="actions-toolbar">
              <IonButton fill="clear" size="small" :router-link="`/dashboard/novel/${novel.id}/update`">
                <IonIcon slot="start" :icon="createOutline"></IonIcon>
                Editar
              </IonButton>
              <IonButton fill="clear" size="small" :router-link="`/dashboard/novel/${novel.id}/chapters`">
                <IonIcon slot="start" :icon="add"></IonIcon>
                Capítulos
              </IonButton>
              <IonButton fill="clear" size="small" color="danger" @click="confirmDelete(Number(novel.id), novel.title)">
                <IonIcon slot="start" :icon="trashOutline"></IonIcon>
                Eliminar
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonList>

    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonSpinner, 
  IonButtons, IonMenuButton, IonImg, alertController, toastController
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { 
  addCircleOutline, createOutline, trashOutline, alertCircleOutline, bookOutline, add 
} from 'ionicons/icons';
import { useAuthStore } from '@/stores/useAuthStore';
import NovelService from '@/services/NovelService';
import { INovel } from '@/interfaces/INovel';
import { ICreatorNovel } from '@/interfaces/ICreatorNovel';

const managedNovels = ref<ICreatorNovel[]>([]);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const authStore = useAuthStore();

const loadManagedNovels = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await NovelService.getDashboardNovels();

    if (response.success && response.data?.novels) {
      managedNovels.value = response.data.novels;
    } else {
      throw new Error(response.message || "No se pudieron cargar las novelas.");
    }
  } catch (err: any) {
    console.error("Error al cargar novelas del dashboard:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async (novelId: number, novelTitle: string) => {
  const alert = await alertController.create({
    header: 'Confirmar Eliminación',
    message: `¿Estás seguro de que quieres eliminar la novela "${novelTitle}"? Esta acción no se puede deshacer y eliminará todos sus capítulos.`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          handleDeleteNovel(novelId);
        },
      },
    ],
  });
  await alert.present();
};

const handleDeleteNovel = async (novelId: number) => {
  try {
    const response = await NovelService.deleteNovel(novelId.toString());
    if (response.success) {
      managedNovels.value = managedNovels.value.filter(n => n.id !== novelId);
      const toast = await toastController.create({
        message: 'Novela eliminada correctamente.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } else {
      throw new Error(response.message || 'Error al eliminar la novela.');
    }
  } catch (error: any) {
    const toast = await toastController.create({
      message: `Error: ${error.message}`,
      duration: 3000,
      color: 'danger'
    });
    await toast.present();
  }
};

onMounted(() => {
  loadManagedNovels();
});
</script>

<style scoped>
.empty-state {
  margin-top: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--ion-color-medium);
}
.empty-icon {
  font-size: 4em;
}
.novel-card {
  margin-bottom: 16px;
}
.actions-toolbar {
  display: flex;
  justify-content: space-around;
  padding-top: 8px;
}
.containerButton {
 
  margin-top: 50px;
  margin-bottom: 25px;

}
ion-img {
  width: 20rem;
  height: 20rem;
  border-radius: 8px;
}
ion-list {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  
}
ion-card {
  background-color: var(--ion-color-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>