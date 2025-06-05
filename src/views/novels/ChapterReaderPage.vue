<template>
  <IonContent :fullscreen="true" class="ion-padding chapterReader">
    <IonTitle>{{ 'Lector' }}</IonTitle>
    <div v-if="isLoadingChapter" class="containerSpinner ion-text-center ion-padding-top">
      <IonSpinner name="crescent"></IonSpinner>
      <p>Cargando capítulo...</p>
    </div>
    <div v-if="error" class="ion-padding ion-text-center containerError">
      <IonIcon :icon="alertCircleOutline" color="danger" style="font-size: 2em;"></IonIcon>
      <p>Error al cargar el capítulo: {{ error }}</p>
      <IonButton @click="loadChapterContent">Reintentar</IonButton>
    </div>
    <div v-if="currentChapterData && !isLoadingChapter && !error" class="chapterContent">
      <div v-if="currentChapterData.content_type === 'text'" class="textContent">
        <h2>{{ currentChapterData.title }}</h2>
        <p>{{ currentChapterData.content }}</p>
      </div>

      <!--Si el contenido es una imagen se muestran imágenes-->
      <div v-else-if="currentChapterData.content_type === 'image' || currentChapterData.content_type === 'comic_page'" class="imageContent">
        <h2>{{ currentChapterData.title }}</h2>
        <IonImg :src="currentChapterData.content" alt="Imagen del capítulo" @ion-error="onImageError"></IonImg>
      </div>

      <!--Si el contenido es un video se muestra un reproductor de video-->
      <div v-else-if="currentChapterData.content_type === 'video'" class="videoContent">
        <h2>{{ currentChapterData.title }}</h2>
        <video controls :src="currentChapterData.content" type="video/mp4" style="width: 100%; max-height: 80vh;">
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

      <div v-else>
        <p>Contenido no soportado o desconocido.</p>
      </div>
    </div>

    <div v-if="!isLoadingNovelInfo && allChaptersForNovel.length > 0 && !error" class="navigationButtons ion-padding-top ion-text-center">
        <IonButton @click="goToPreviousChapter" :disabled="!previousChapterId">
          <IonIcon slot="start" :icon="arrowBackCircleOutline"></IonIcon>
          Anterior
        </IonButton>
        <span>Capítulo {{ currentChapterIndex + 1 }} de {{ allChaptersForNovel.length }}</span>
        <IonButton @click="goToNextChapter" :disabled="!nextChapterId">
          Siguiente
          <IonIcon slot="end" :icon="arrowForwardCircleOutline"></IonIcon>
        </IonButton>
    </div>

  </IonContent>>
</template>

<script setup lang="ts">
  import {  IonButton, IonContent, IonTitle , IonIcon, IonImg} from '@ionic/vue';
  import { alertCircleOutline, arrowForwardCircleOutline, arrowBackCircleOutline } from 'ionicons/icons';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted, watch, computed, normalizeClass } from 'vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { IChapter } from '@/interfaces/IChapter';
  import NovelService from '@/services/NovelService';
  import { all } from 'axios';
import ReadingService from '@/services/ReadingService';

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();

  const error = ref<string | null>(null);

  //Variables para la información de la novela y su lista de capítulos
  const novelId = ref<string | null>(null);
  const novelOverallTitle = ref<string>('');
  const allChaptersForNovel = ref<IChapter[]>([]);
  const isLoadingNovelInfo = ref<boolean>(true);
  //Variables para el contenido del capítulo actual
  const currentChapterId = ref<string | null>(null);
  const currentChapterData = ref<IChapter | null>(null);
  const isLoadingChapter = ref<boolean>(false);

  //Función para guardar el progreso de lectura
  const saveReadingProgress = async (chapterId: string, progressValue: number) => {
    //Solo se guarda el progreso si el usuario está autenticado
    if (!authStore.token){
      console.warn('No se puede guardar el progreso de lectura, usuario no autenticado.');
      return;
    }
    try {
      const progressToSave = Math.round(progressValue);
      console.log('Guardando progreso de lectura:', { chapterId, progressValue });
      const response = await ReadingService.saveReadingProgress(Number(chapterId), progressToSave);
      if (response.success) {
        console.log('Progreso de lectura guardado correctamente: ', response.message);
      } else {
        console.warn('No se pudo guardar el progreso de lectura:', response.message);
      }
    } catch (error:any) {
      console.error('Error al guardar el progreso de lectura:', error.message);
    }
  }

  //Funciones para la logica de navegación entre capítulos
  const currentChapterIndex = computed(() => {
    if (!currentChapterId.value || !allChaptersForNovel.value) return -1;
    return allChaptersForNovel.value.findIndex(chapter => chapter.id.toString() === currentChapterId.value);
  })
  const previousChapterId = computed(() => {
    if (currentChapterIndex.value > 0) {
      return allChaptersForNovel.value[currentChapterIndex.value - 1].id.toString();
    }
    return null;
  })
  const nextChapterId = computed(() => {
    if (currentChapterIndex.value >=0 && currentChapterIndex.value < allChaptersForNovel.value.length - 1) {
      return allChaptersForNovel.value[currentChapterIndex.value + 1].id.toString();
    }
    return null;
  })
  const navigateToChapter = (chapterId: string | null) => {
    if (chapterId && novelId.value) {
      router.push({ name: 'ChapterReader', params: { id: novelId.value }, query: { chapter: chapterId } });
    }
  }
  
  const goToPreviousChapter = () => { navigateToChapter(previousChapterId.value); }
  
  const goToNextChapter = () => { 
    if (currentChapterId.value){
      //Marca el capítulo actual como leído antes de navegar al siguiente
      saveReadingProgress(currentChapterId.value, 100); 
    }
    navigateToChapter(nextChapterId.value); 
  }
 
 
  // Funciones para cargar datos
  const loadNovelInfoAndChaptersList = async (novelId: string) => {
    isLoadingNovelInfo.value = true;
    error.value = null;

    try {
      const response = await NovelService.getNovelById(novelId);
      if (response.success && response.data?.novel) {
        novelOverallTitle.value = response.data.novel.title || 'Novela sin título';
        allChaptersForNovel.value = response.data.novel.chapters || [];
      }else {
        throw new Error(response.message || 'No se pudieron obtener los datos de la novela correctamente.');
      }
    } catch (error:any) {
      error.value = 'Error al cargar la novela: ' + error.message;
      allChaptersForNovel.value = [];
    } finally {
      isLoadingNovelInfo.value = false;
    }
  }


  const loadChapterContent = async (novelId: string, chapterId: string) => {
    if (!novelId || !chapterId) {
      error.value = 'Falta ID de novela o capítulo.';
      currentChapterData.value = null;
      return;
    }
    
    isLoadingChapter.value = true;
    error.value = null;
    currentChapterData.value = null;

    try {
      const response = await NovelService.getChapterContent(novelId, chapterId);
      if (response.success && response.data?.chapter) {
        currentChapterData.value = response.data.chapter;

        //Llamada a la función para guardar el progreso de lectura
      } else {
        throw new Error(response.message || 'No se pudo cargar el contenido del capítulo.');
      }
    } catch (error:any) {
      error.value = 'Error al cargar el capítulo: ' + error.message;
      currentChapterData.value = null;
    } finally {
      isLoadingChapter.value = false;
    }
  }

  // Función para manejar errores de imagen
  const onImageError = (event: Event) => {
    console.log('Error al cargar la imagen del capítulo:', (event.target as HTMLImageElement)?.src);
    (event.target as HTMLImageElement).src = '/assets/images/placeholder-image.png'; // Ruta a una imagen de marcador de posición
  }

  const loadInitialData = async () => {
    const novelIdFromRoute = route.params.id as string;
    const chapterIdFromQuery = route.query.chapter as string | undefined;

    novelId.value = novelIdFromRoute;
    if (!novelIdFromRoute){
      error.value = 'ID de novela no encontrado en la ruta.';
      isLoadingNovelInfo.value = false;
      isLoadingChapter.value = false;
      return;
    }

    await loadNovelInfoAndChaptersList(novelIdFromRoute);

    if (error.value) {
      isLoadingNovelInfo.value = false;
      return;
    }

    let targetChapterId = chapterIdFromQuery;
    if (!targetChapterId && allChaptersForNovel.value.length > 0) {
      // Si no se especifica un capítulo, se carga el primer capítulo
      targetChapterId = allChaptersForNovel.value[0].id.toString();

      //Si no hay id de capítulo en la ruta, y es el primer capítulo, se actualiza la ruta
      if (router.currentRoute.value.query.chapter !== targetChapterId) {
        router.replace({ query: { ...route.query, chapter: targetChapterId } });
      }
    }
    if (targetChapterId) {
      currentChapterId.value = targetChapterId;
      await loadChapterContent(novelIdFromRoute, targetChapterId);
    } else if (allChaptersForNovel.value.length === 0) {
      error.value = 'Esta novela no tiene capítulos disponibles.';
    }
  }

  //Observar cambios en la ruta para cargar diferentes capítulos/novelas
  watch(() => [route.params.id, route.query.chapter], async ([newNovelId, newChapterQueryId], ) => {
    const nvlId = newNovelId as string;
    const chapterQueryId = newChapterQueryId as string | undefined;

    if (!nvlId) return;

    //Si el ID de novela ha cambiado, recargar la información de la novela y los capítulos
    if (nvlId !== novelId.value || allChaptersForNovel.value.length === 0) {
      novelId.value = nvlId;
      await loadNovelInfoAndChaptersList(nvlId);

      if (error.value) return;
    }

    let targetChapterToLoad = chapterQueryId;
    if (!targetChapterToLoad && allChaptersForNovel.value.length > 0) {
      // Si no se especifica un capítulo, se carga el primer capítulo
      targetChapterToLoad = allChaptersForNovel.value[0].id.toString();

      //Si no hay id de capítulo en la ruta, y es el primer capítulo, se actualiza la ruta
      if (targetChapterToLoad && targetChapterToLoad !== currentChapterId.value) {
        currentChapterId.value = targetChapterToLoad;
        await loadChapterContent(nvlId, targetChapterToLoad);
      }else if (targetChapterToLoad && !currentChapterData.value && !isLoadingChapter.value){
        currentChapterId.value = targetChapterToLoad;
        await loadChapterContent(nvlId, targetChapterToLoad);
      }
    }
  })
  onMounted(() => {
    loadInitialData();
  });
</script>

<style scoped>
.chapterReader {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chapterContent {
  margin-bottom: 20px;
  min-height: 300px;
}
.textContent p{
  white-space: pre-wrap; /* Mantiene los saltos de línea y espacios */
  font-size: 1.1em;
  line-height: 1.7;
  padding: 10px;
}
.imageContent  ion-img::part(image){ /*Asegura que la imagen se muestre correctamente*/
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}
.videoContent video {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
.navigationButtons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
.navigationButtons span {
  font-size: 0.9em;
  color: var(--ion-color-medium-shade);
}
</style>
