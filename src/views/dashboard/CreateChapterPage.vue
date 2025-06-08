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
  const { formData, file } = eventData;

  // --- MODO DEPURACIÓN ---
  // El objetivo es ver qué responde el API cuando solo subimos el archivo.

  if (file) {
    console.log("--- INICIANDO DEPURACIÓN DE SUBIDA DE ARCHIVO ---");
    console.log("Archivo que se va a subir:", file);
    isSubmitting.value = true; // Para que se vea el spinner en el botón

    try {
      const uploadResponse = await NovelService.uploadMedia(file);
      
      // ESTE ES EL LOG MÁS IMPORTANTE.
      // Revisa la consola del navegador y expande este objeto para ver su contenido.
      console.log("Respuesta COMPLETA del API de subida:", uploadResponse);

      alert("Depuración finalizada. Por favor, revisa la consola del navegador (F12).");

    } catch (error) {
      console.error("El API de subida falló con un error:", error);
      alert("La subida del archivo falló. Revisa la consola para ver el error del API.");
    } finally {
      isSubmitting.value = false; // Detenemos el spinner
      console.log("--- FIN DE LA DEPURACIÓN ---");
    }

  } else {
    alert("Para depurar, por favor selecciona un archivo primero.");
  }
};


</script>
<style scoped>
.container {
  margin: 40px auto;
  padding: 20px;
}
</style>