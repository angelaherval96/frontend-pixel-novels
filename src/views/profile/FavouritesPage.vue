<template>
  <IonContent :fullscreen="true" class="ion-padding">
    <IonTitle> Mis favoritas</IonTitle>
    <div v-if="isLoading" class="ion-text-center ion-padding-top">
      <IonSpinner name="crescent"></IonSpinner>
      <p>Cargando favoritos...</p>
    </div>
    <div v-if="error && !isLoading" class="containerError ion-padding ion-text-center">
      <IonIcon :icon="alertCircleOutline" color="danger" style="font-size: 3em;"></IonIcon>
      <p>Error al cargar favoritos: {{ error }}</p>
      <IonButton @click="loadFavourites">Reintentar</IonButton>
    </div>

    <div v-if="!isLoading && favourites.length === 0 && !error" class="empty-state">
      <IonIcon :icon="heartDislikeCircleOutline" class="empty-icon"></IonIcon>
      <h3>Aún no tienes favoritos</h3>
      <p>Explora el catálogo y añade las novelas que más te gusten.</p>
      <IonButton router-link="/novels" expand="block" color="primary">Ir al Catálogo</IonButton>
    </div>

    <IonList v-if="!isLoading && favourites.length > 0 && !error">
      <IonItemSliding v-for="novel in favourites" :key="novel.id">
        <IonItem button :router-link="`/novels/${novel.id}/detail`">
          <IonThumbnail slot="start">
            <IonImg :src="novel.cover"></IonImg>
          </IonThumbnail>
          <IonLabel>
            <h2>{{ novel.title }}</h2>
            <p v-if="novel.description">{{ novel.description.substring(0, 100) }}</p>
          </IonLabel>
        </IonItem>

        <IonItemOptions side="end">
          <IonItemOption color="danger" @click="removeFromFavourites(Number(novel.id))">
            <IonIcon slot="icon-only" :icon="heartDislikeCircleOutline"></IonIcon>
            Eliminar
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    </IonList>
  </IonContent>
</template>

<script setup lang="ts">
import router from '@/router';
import {  IonTitle, IonContent, IonSpinner, IonIcon, IonButton, IonList, IonItemSliding, IonThumbnail, IonImg, IonLabel, IonItem, IonItemOptions, IonItemOption, toastController } from '@ionic/vue';
import { heartDislikeCircleOutline, alertCircleOutline  } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import FavouriteService from '@/services/FavouriteService';
import { INovel } from '@/interfaces/INovel';

const favourites = ref<INovel[]>([]);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

const loadFavourites = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await FavouriteService.getFavouriteNovels();
    if (response.success && response.data?.favouriteNovels) {
      favourites.value = response.data.favouriteNovels;
    } else {
      favourites.value = [];
      error.value = 'No se encontraron favoritos';
    }
  } catch (error:any) {
      console.error('Error al cargar favoritos:', error);
      error.value = error.message || 'Error al cargar favoritos';
    } finally {
      isLoading.value = false;
    }
  
}

const removeFromFavourites = async (novelId: number) => {
  try {
    const response = await FavouriteService.removeNovelFavourites(novelId);
    if (response.success) {
      //Actualiza la lista de favoritos en el forntend sin tener que volver a llamar a la API
      favourites.value = favourites.value.filter(novel => novel.id !== novelId);
    
      const toast = await toastController.create({
        message: 'Novela eliminada de favoritos',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();

    } else {
      error.value = response.message || 'Error al eliminar el favorito';
    }
  } catch (error:any) {
    console.error('Error al eliminar favorito:', error);
    //Muestra una notificación de error (Toast)
    const toast = await toastController.create({
      message: error.message || 'Error al eliminar el favorito',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }
}

onMounted(() => {
  loadFavourites();
});

</script>

<style scoped>
.empty-state {
  margin-top: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
    font-size: 4em; 
    color: var(--ion-color-medium);
}
</style>