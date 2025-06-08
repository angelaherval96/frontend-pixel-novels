<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Añadir Nuevo Capítulo</IonTitle>
      </IonToolbar>
      
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="container">
        <ChapterForm :initial-data="emptyChapter" textButton="Crear Capítulo" :is-submitting="isSubmitting" @onSubmit="sendForm"/>
      </div>
     
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChapterForm from '@/components/ChapterForm.vue';
import { IChapter } from '@/interfaces/IChapter';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import NovelService from '@/services/NovelService';

const route = useRoute();
const router = useRouter();

const isSubmitting = ref(false);

const novelId = Number(route.params.id); // Obtiene el ID de la novela desde los parámetros de la ruta

const emptyChapter: Partial<IChapter> = {
  title: '',
  content: '',
  content_type: 'text', // Valor por defecto
  order: 1
};

const sendForm = async (eventData: { formData: Partial<IChapter>, file?: File | null }) => {
  // Extrae de datos del evento
  const { formData, file } = eventData;

  if (!novelId) {
    alert("Error: No se ha encontrado el ID de la novela.");
    return;
  }

  isSubmitting.value = true;
  let finalErrorMessage = 'Ocurrió un error inesperado al crear el capítulo.';

  try {
    // Crea una copia del formData para evitar cambios directos.
    const eventDataToSubmit = { ...formData };

    // Si hay un archivo, lo sube y asigna la URL al contenido.
    if (file) {
      const uploadResponse = await NovelService.uploadMedia(file);
      if (uploadResponse.success && uploadResponse.data?.url) {
        eventDataToSubmit.content = uploadResponse.data.url;
      } else {
        throw new Error(uploadResponse.message || 'Falló la subida del archivo.');
      }
    }
    
    // Comprueba que el contenido del capítulo no esté vacío.
    if (!eventDataToSubmit.content) {
      throw new Error("El contenido del capítulo no puede estar vacío.");
    }
    
    // Crea el capítulo utilizando el servicio.
    const createResponse = await NovelService.createChapter(novelId.toString(), eventDataToSubmit);
    
    if (createResponse.success) {
      await toastController.create({
        message: '¡Capítulo creado con éxito!',
        duration: 2000,
        color: 'success',
        position: 'top'
      }).then(t => t.present());
      
      router.push({ name: 'ManageChaptersDashboard', params: { id: novelId } });
    } else {
      throw new Error(createResponse.message || 'No se pudo crear el capítulo.');
    }
  } catch (error: any) {
    // Manejo de errores para todo el proceso.
    console.error('Error al crear el capítulo:', error);
    // Si el error tiene una respuesta con errores de validación, los muestra.
    if (error.response && error.response.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        finalErrorMessage = validationErrors.join(' ');
    } else {
        finalErrorMessage = error.message;
    }
    await toastController.create({
      message: finalErrorMessage,
      duration: 4000,
      color: 'danger',
      position: 'top'
    }).then(t => t.present());
  } finally {
    isSubmitting.value = false;
  }
};


</script>
<style scoped>
.container {
  margin: 40px auto;
  padding: 20px;
}
</style>