<template>
  <IonContent :fullscreen="true" class="ion-padding">
    <IonButtons slot="start">
      <IonBackButton default-href="/novels"></IonBackButton>
    </IonButtons>
    <IonTitle>{{ novel?.title || 'Detalle novela' }}</IonTitle>
 
    <div v-if="isLoading" class="containerSpinner ion-text-center ion-padding-top">
      <IonSpinner name="crescent"></IonSpinner>
      <p>Cargando detalles de la novela...</p>
    </div>

    <div v-if="error && !isLoading" class="containerError ion-padding ion-text-center">
      <IonIcon :icon="alertCircleOutline" color="danger" style="font-size:  2em;"></IonIcon>
      <p>Error al cargar la novela: {{ error }}</p>
      <IonButton @click="getNovelDetails">Reintentar</IonButton>
    </div>
    
    <div v-if="novel && !isLoading && !error">
      <IonImg :src="novel.cover || 'https://enlace'" :alt="'Portada de ' + novel.title"></IonImg>
    </div>

    <h1 class="ion-text-center">{{ novel?.title }}</h1>

    <IonCard>
      <IonCardContent>
        <p><strong>Creador:</strong>{{ novel?.creator?.name || 'Desconocido' }}</p>
        <p><strong>Descripción:</strong>{{ novel?.description || 'No disponible' }}</p>
        <p><strong>Idioma:</strong>{{ novel?.language || 'No especificado' }}</p>
        <p><strong>Fecha de Publicación:</strong>{{ formatDate(novel?.created_at) }}</p>
        </IonCardContent>
    </IonCard>

    <h3 class="ion-margin-top">Capítulos</h3>
    <IonList v-if="novel?.chapters && novel.chapters.length > 0">
        <IonItem v-for="chapter in novel.chapters" :key="chapter.id">
            <IonButton @click="goToChapter(novel?.id, chapter.id)" detail="true">Leer Capítulo</IonButton>
            <IonLabel>{{ chapter.title || 'Capítulo sin título' }}</IonLabel>
        </IonItem>
    </IonList>
    <p v-else> No hay capítulos disponibles para esta novela.</p>

    <div class="ion-margin-top">
      <!-- Llama a la función para añadir a favoritos solo si novela y su id están definidos -->
      <IonButton expand="block" @click="() => { if (novel && novel.id !== undefined) addToFavourites(novel.id); }" :disabled="isFavoriting">
        <IonIcon slot="start" :icon="heartOutline"></IonIcon>
        Añadir a Favoritos
        <IonSpinner v-if="isFavoriting" name="dots" slot="end"></IonSpinner>
      </IonButton>

      <IonButton expand="block" color="secondary" @click="() => { if (novel && novel.id !== undefined && novel.chapters) startReading(novel.id, novel.chapters); }" class="ion-margin-top">
        <IonIcon slot="start" :icon="playCircleOutline"></IonIcon>
        Empezar a leer
      </IonButton>
    </div>
 </IonContent>
</template>

<script setup lang="ts">
import { IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner, IonIcon, IonButton, IonImg, IonCard, IonCardContent, IonList, IonItem, IonLabel, toastController } from '@ionic/vue';
import { alertCircleOutline, playCircleOutline, heartOutline } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { IUser } from '@/interfaces/IUser';
import { IChapter } from '@/interfaces/IChapter';
import { INovelDetail } from '@/interfaces/INovelDetail';
import NovelService from '@/services/NovelService';
import api from '@/services/ApiService';
import { IChapterListItem } from '@/interfaces/IChapterListItem';
import FavouriteService from '@/services/FavouriteService';

const route = useRoute();
const router = useRouter();

const novel = ref<INovelDetail | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const isFavoriting = ref<boolean>(false);
const authStore = useAuthStore();
const novelId = route.params.id as string;

//Función para obtener los datos de la novela
const getNovelDetails = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    //Llama al servicio
    const apiResponse = await NovelService.getNovelById(novelId);
    if (apiResponse.success && apiResponse.data && apiResponse.data.novel){
      novel.value = apiResponse.data.novel; 

    }else {
      //Si success es falsa o data o data.novel no existen, usa el mensaje de la API o uno genérico
      throw new Error(apiResponse.message || 'No se pudieron obtener los datos de la novela correctamente.')
    }
  } catch (error: any) {
    console.error("Error al obtener los datos de la novela:", error);
    error.value = error.message || "No se pudieron cargar los detalles de la novela.";
    novel.value = null;
  }finally{
    isLoading.value = false;
  }
}

onMounted(()=>{
  if (novelId) {
    getNovelDetails();
  } else {
    error.value = "ID de la novela no encontrado en la ruta.";
    isLoading.value = false;
    
  }
})

//Función para formatear la fecha
const formatDate = (dateString?: string) => {
  if (!dateString) {
    return "Fecha no disponible";
  }else{
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day:'numeric'
    });
  }
}

//Función para añadir a favoritos
const addToFavourites = async (idNovela:number) => {
  if (!authStore.token){
    alert('Debes iniciar sesión para añadir a favoritos.')
    router.push({ name: 'Login' });
    return;
  }
  isFavoriting.value = true;
  try {
    const apiResponse = await FavouriteService.addNovelFavourites(idNovela.toString());
    if (apiResponse.success){
      const toast = await toastController.create({
        message: 'Añadido a favoritos correctamente.',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
    }else{
      throw new Error(apiResponse.message || 'Error al añadir a favoritos.');
    }
  } catch (error:any) {
    console.error("Error adding to favourites:", error);
    const toast = await toastController.create({
      message: error.message || 'Error al añadir a favoritos.',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();

  }finally{
    isFavoriting.value = false;
  }
}

//Función para ir a los capítulos
const goToChapter = (currentNovelId:number | undefined, chapterId: number | undefined) => {
  //Comprueba que los ids son números antes de usarlos
  if (typeof currentNovelId !== 'number' || typeof chapterId !== 'number') {
    console.error("ID de novela o capítulo no válido", { currentNovelId, chapterId });
    alert('No se puedo cargar el capítulo. Id de novela o capítulo no válido.');
    return;
  }
  
  router.push({ name: 'ChapterReader', params: { id: currentNovelId.toString()}, query: { chapter: chapterId.toString()}});
}

//Función para empezar a leer
const startReading = (currentNovelId: number, chapters: IChapter[]) => {
  // Comprueba que el array de capítulos existe y no está vacío
  if (chapters && chapters.length > 0) {
    const firstChapter = chapters[0];
    // Verifica que el primer capítulo es un objeto válido y tiene un 'id' numérico
    if (firstChapter && typeof firstChapter.id === 'number') {
      goToChapter(currentNovelId, firstChapter.id);
    } else {
      // Si el primer capítulo no es válido o no tiene ID, navega al lector general de la novela
      console.warn(`Primer capítulo inválido o sin ID para la novela ${currentNovelId}. Navegando al lector general.`);
      router.push({ name: 'ChapterReader', params: { id: currentNovelId.toString() } });
    }
  } else {
    // Si no hay capítulos, navega al lector general de la novela
    console.warn(`No hay capítulos para la novela ${currentNovelId}. Navegando al lector general.`);
    router.push({ name: 'ChapterReader', params: { id: currentNovelId.toString() } });
  }
}

</script>


<style scoped>
  ion-img{
    width: 100%; 
    max-width: 500px; 
    margin: 0 auto 16px auto; 
    display: block;
    border-radius: 8px
  }
  .containerSpinner, .containerError {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh; 
}
.containerError ion-icon {
  font-size: 3em; 
  margin-bottom: 10px;
}
ion-card-content p {
  margin-bottom: 8px;
  line-height: 1.6;
}
h1 {
  font-weight: bold;
  margin-bottom: 16px;
}
h3 {
  margin-top: 24px;
  margin-bottom: 10px;
  font-weight: bold;
  border-bottom: 1px solid var(--ion-color-step-200, #cccccc);
  padding-bottom: 6px;
}
</style>