<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Historial de Lectura</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" class="ion-padding">
      <div v-if="isLoading">
        <IonSpinner name="crescent"></IonSpinner>
        <p class="ion-text-center">Cargando...</p>
      </div>

      <div v-if="error && !isLoading" class="ion-text-center ion-padding">
        <IonIcon :icon="alertCircleOutline" color="danger"></IonIcon>
        <p>Error al cargar los datos: {{ error }}</p>
        <IonButton @click="loadReadings">Reintentar</IonButton>
      </div>

      <div v-if="!isLoading && readings.length === 0 && !error" class="ion-text-center ion-padding">
        <IonIcon :icon="hourglassOutline" class="empty-icon"></IonIcon>
        <h3>No hay lecturas registradas.</h3>
        <p>¡Empieza a leer novelas para ver tu historial aquí!</p>
        <IonButton :router-link="{name: 'Novels'}">Explorar Novelas</IonButton>
      </div>

      <IonList v-if="!isLoading && readings.length > 0">

        <IonListHeader>
          <IonTitle>Lecturas Recientes</IonTitle>
        </IonListHeader>

        <IonItem v-for="reading in readings" :key="reading.id" @click="continueReading(reading)">
          <IonLabel>
            <h2>{{ reading.chapter.novel.title }}</h2>
            <p>Capítulo: {{ reading.chapter.title }}</p>
            <IonProgressBar :value="reading.progress / 100" color="primary" class="ion-margin-top"></IonProgressBar>
            <p>{{ reading.progress }}% completado</p>
          </IonLabel>
        </IonItem>
      </IonList>
          
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonProgressBar, IonItem, IonLabel, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { hourglassOutline, alertCircleOutline } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReadingService from '@/services/ReadingService';
import { IReading } from '@/interfaces/IReading';

const router = useRouter();
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const readings = ref<IReading[]>([]);

const loadReadings = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await ReadingService.getReading();
    if (response.success && response.data?.readings) {
      readings.value = response.data.readings;
    } else {
      readings.value = [];
      if (!response.success) {
        error.value = response.message || 'No se pudieron cargar las lecturas.';
      }
    }
    
  } catch (error:any) {
    error.value = 'Error al cargar las lecturas. Por favor, inténtalo de nuevo más tarde.';
  } finally {
    isLoading.value = false;
  }
};

//FUnción para continuar leyendo un capítulo, redirige al lector al capítulo correspondiente
const continueReading = (reading: IReading) => {
  router.push({ name: 'ChapterReader', params: { id: reading.chapter.novel.id, chapterId: reading.chapter.id } });
};

onMounted(() => {
  loadReadings();
});
</script>
