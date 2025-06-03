<template>
  <IonContent :fullscreen="true" class="ion-padding">
    <IonButtons slot="start">
      <IonBackButton default-href="/novels"></IonBackButton>
    </IonButtons>
    <IonTitle>{{ novel && NovelService.title ? NovelService.title : 'Detalle novela' }}</IonTitle>
 
    <div v-if="isLoading" class="containerSpinner">
      <IonSpinner name="crescent"></IonSpinner>
      <p>Cargando detalles de la novela...</p>
    </div>

    <div v-if="error" class="containerError ion-padding">
      <IonIcon :icon="alertCircleOutline" color="danger"></IonIcon>
      <p>Error al cargar la novela: {{ error }}</p>
      <IonButton @click="getNovelDetails">Reintentar</IonButton>
    </div>
    
    <div v-if="novel && !isLoading && !error">
      <IonImg :src="NovelService.cover || 'https://enlace'" :alt="'Portada de ' + novel.title"></IonImg>
    </div>

    <h1 class="ion-text-center">{{ novel.title }}</h1>

    <IonCard>
      <IonCardContent>
        <p><strong>Creador:</strong>{{ novel.creator?.name || 'Desconocido' }}</p>
        <p><strong>Descripción:</strong>{{ novel.description || 'No disponible' }}</p>
        <p><strong>Idioma:</strong>{{ novel.language || 'No especificado' }}</p>
         <p><strong>Fecha de Publicación:</strong>{{ formatDate(novel.created_at) }}</p>
        </IonCardContent>
    </IonCard>

    <h3 class="ion-margin-top">Capítulos</h3>
    <IonList v-if="novel.chapters && novel.chapters.length > 0">
        <IonItem v-for="chapter in novel.chapters" :key="chapter.id">
            <IonButton @click="goToChapter(novel.id, chapter.id, chapter.title)"></IonButton>
            <IonLabel>{{ chapter.title || 'Capítulo sin título' }}</IonLabel>
        </IonItem>
    </IonList>
    <p v-else> No hay capítulos disponibles para esta novela.</p>

    <div class="ion-margin-top">
      <IonButton expand="block" @click="addToFavourites(novel.id)" :disabled="isFavoriting">
        <IonIcon slot="start" :icon="heartOutline"></IonIcon>
        Añadir a Favoritos
        <IonSpinner v-if="isFavoriting" name="dots" slot="end"></IonSpinner>
      </IonButton>

      <IonButton expand="block" color="secondary" @click="startReading(novel.id, novel.chapters)" class="ion-margin-top">
        <IonIcon slot="start" :icon="playCircleOutline"></IonIcon>
        Empezar a leer
      </IonButton>
    </div>
 </IonContent>
</template>

<script setup lang="ts">
import { IonTitle, IonContent, IonBackButton, IonButtons, IonSpinner, IonIcon, IonButton, IonImg, IonCard, IonCardContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import { alertCircleOutline, playCircleOutline, heartOutline } from 'ionicons/icons';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { IUser } from '@/interfaces/IUser';
import { IChapter } from '@/interfaces/IChapter';
import { ICreatorNovel } from '@/interfaces/ICreatorNovel';
import { INovelDetail } from '@/interfaces/INovelDetail';
import NovelService from '@/services/NovelService';
import api from '@/services/ApiService';

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
const addToFavourites = async (id:number) => {
  if (!authStore.token){
    alert('Debes iniciar sesión para añadir a favoritos.')
    router.push({ name: 'Login' });
    return;
  }
  isFavoriting.value = true;
  try {
    const apiResponse = await NovelService.addNovelFavourites(id.toString());
    if (apiResponse.success){
      alert(apiResponse.message || '¡Añadido a favoritos!');
    }else{
      throw new Error(apiResponse.message || 'Error al añadir a favoritos.');
    }
  } catch (error:any) {
    console.error("Error adding to favourites:", error);
    alert(`Error: ${error.message}`);

  }finally{
    isFavoriting.value = false;
  }
}

//Función para ir a los capítulos
const goToChapter = (currentNovelId:number, chapterId: number, chapterTitle?: string) => {
  router.push({ name: 'ChapterReader', params: { id: currentNovelId.toString()}, query: { chapter: chapterId.toString()}});
}

//Función para empezar a leer
const startReading = (currentNovelId: number, chapters?: IChapterListItem[]) => {
  if (chapters && chapters.length > 0) {
    goToChapter(currentNovelId, chapters[0].id, chapters[0].title);

  } else {
    router.push({ name: 'ChapterReader', params: { id: currentNovelId.toString()}});
  }
}

</script>
