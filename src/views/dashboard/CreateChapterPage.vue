<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Añadir Nuevo Capítulo</IonTitle>
      </IonToolbar>
      
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="container">
        <ChapterForm :initial-data="emptyChapter" textButton="Crear Capítulo" :is-submitting="isSubmitting" @on-submit="sendForm"/>
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

const sendForm = async (formData: Partial<IChapter>) => {

  if (!novelId) {
    console.error('No se ha encontrado el ID de la novela.');
    return;
  }
  isSubmitting.value = true;

  try {
    const response = await NovelService.createChapter(novelId.toString(), formData);
    if (response.success) {
      const toast = await toastController.create({
        message: 'Capítulo creado correctamente.',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();

      router.push({ name: 'ManageChaptersDashboard', params: { id: novelId }});
    }else{
      throw new Error(response.message || 'No se pudo crear el capítulo.');
    }
  } catch (error:any) {
    const toast = await toastController.create({
      message: error.message || 'Error al crear el capítulo.',
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
    console.error('Error al crear el capítulo:', error);
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