<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Editar Capítulo</IonTitle>
      </IonToolbar>
    </IonHeader>
   
    <IonContent :fullscreen="true" class="ion-padding">

      <div class="container">
        <h1 v-if="chapterToEdit">Editando: {{ chapterToEdit?.title }}</h1>
            
        <div v-if="isLoading">
          <IonSpinner name="crescent" class="ion-padding-top"></IonSpinner>
            Cargando...
        </div>

        <div v-if="error">
          <IonIcon :icon="alertCircleOutline" color="danger"></IonIcon>
          <p>Error al cargar el capítulo: {{ error }}</p>
          <IonButton @click="loadChapterData">Reintentar</IonButton>
        </div>
      </div>
        

        <ChapterForm v-if="chapterToEdit" :initial-data="chapterToEdit" textButton="Actualizar Capítulo" :is-submitting="isSubmitting" @on-submit="sendForm"/>
      
    </IonContent>
    
   
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChapterForm from '@/components/ChapterForm.vue';
import { IChapter } from '@/interfaces/IChapter';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonSpinner, IonButton, toastController } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import NovelService from '@/services/NovelService';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const chapterToEdit = ref<IChapter | null>(null);

const novelId = Number(route.params.id); // Obtiene el ID de la novela desde los parámetros de la ruta
const chapterId = Number(route.params.chapterId); // Obtiene el ID del capítulo desde los parámetros de la ruta


const loadChapterData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await NovelService.getChapterContent(novelId.toString(), chapterId.toString());
    if (response.success && response.data?.chapter) {
      chapterToEdit.value = response.data.chapter;
    } else {
      throw new Error(response.message || "No se pudieron cargar los datos del capítulo.");
    }
  } catch (error: any) {
    error.value = error.message || "Error al cargar los datos del capítulo.";
  } finally {
    isLoading.value = false;
  }
};

const sendForm = async (eventData: { formData: Partial<IChapter>, file?: File | null}) => {
  
  const { formData, file } = eventData;
  isSubmitting.value = true;

  try {
    //Se hace una copia del formData para evitar cambios directos.
    const eventDataToSubmit = { ...formData };

    // Si hay un archivo, lo sube y asigna la URL al contenido.
    if (file) {
      const uploadResponse = await NovelService.uploadMedia(file);
      if (uploadResponse.success && uploadResponse.data?.url) {
        // Asigna la URL del archivo subido al campo 'content' del capítulo.
        eventDataToSubmit.content = uploadResponse.data.url;
      } else {
        throw new Error(uploadResponse.message || 'Falló la subida del archivo.');
      }
    }

    // Valida el contenido del capítulo.
    if (!eventDataToSubmit.content) {
      throw new Error('El contenido del capítulo no puede estar vacio.');
    }


    const response = await NovelService.updateChapter(novelId.toString(), chapterId.toString(), eventDataToSubmit);
    if (response.success) {
      const toast = await toastController.create({
        message: 'Capítulo actualizado correctamente.',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
      router.push({ name: 'ManageChaptersDashboard', params: { id: novelId }});
    } else {
      throw new Error(response.message || 'No se pudo actualizar el capítulo.');
    }
  } catch (error:any) {
    console.error('Error al actualizar el capítulo:', error);
    const toast = await toastController.create({
      message: error.message || 'Error al actualizar el capítulo.',
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (novelId && chapterId) {
    await loadChapterData();
  } else {
    error.value = "ID de novela o capítulo no encontrados.";
  }
  isLoading.value = false;
});
</script>

<style scoped>
.container {
  margin: 20px;
  padding: 20px;
}
</style>