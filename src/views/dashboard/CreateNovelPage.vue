<template>
    <IonContent :fullscreen="true" class="ion-padding">
      <h1>Crear Nueva Novela</h1>
      <br>
      <NovelForm :initialData="emptyNovel" textButton="Crear Novela" @onSubmit="sendForm"></NovelForm>
    </IonContent>
  
</template>

<script setup lang="ts">
import { IonContent, toastController } from '@ionic/vue';
import NovelService from '@/services/NovelService';
import { INovel } from '@/interfaces/INovel';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IApiResponse } from '@/interfaces/IApiResponse';
import NovelForm from '@/components/NovelForm.vue';
// Creamos una variable que almanecenará los datos de la novela
const emptyNovel = ref<INovel>({
  title: '',
  description: '',
  language: '',
  cover: ''
});

const router = useRouter();
const isLoading = ref<boolean>(false); 

//Función que se ejecuta al enviar el formulario.
const sendForm = async (eventData: {dataNovel: Partial<INovel>, coverFileUpload?: File | null})=> {
  // Extrae los datos del evento
  const { dataNovel, coverFileUpload: coverFile } = eventData;
  isLoading.value = true; // Cambia el estado de carga a verdadero

  try {
    //Copia de los datos del formulario
    const eventDataToSubmit: Partial<INovel> = ({...dataNovel});
    
    if (!coverFile) {
      await toastController.create({
        message: 'Por favor, sube una imagen de portada.',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      isLoading.value = false; // Cambia el estado de carga a falso si no hay archivo
      return; // Sale de la función si no hay archivo de portada
    }
   
    const uploadResponse = await NovelService.uploadCoverImage(coverFile);
    if (uploadResponse.success && uploadResponse.data?.url) {
      // Si la subida es exitosa, asigna la URL de la imagen al objeto de datos
      eventDataToSubmit.cover = uploadResponse.data.url; // Asigna la URL de la imagen subida
      console.log('Imagen de portada subida correctamente:', eventDataToSubmit.cover);
    } else {
      // Si hay un error en la subida, muestra un mensaje y sale de la función
      await toastController.create({
        message: 'Error al subir la imagen de portada: ' + uploadResponse.message,
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      isLoading.value = false; // Cambia el estado de carga a falso si hay error
      return;
    }


    //Comprueba que esten todos los campos obligatorios del formulario
    if (!eventDataToSubmit.title && !eventDataToSubmit.language && !eventDataToSubmit.description && !eventDataToSubmit.cover) {
      throw new Error('La portada es obligatoria. Por favor, sube una imagen de portada.');
    }

    //Llama al servicio para crear la novela, pasando los datos del formulario
    const response = await NovelService.createNovel(eventDataToSubmit as INovel); // Se utiliza el tipo INovel para asegurar que los datos cumplen con la interfaz
    //Si la respuesta es correcta se limpia el formulario y se redirige a la lista de novelas
    if (response.success){
      await toastController.create({
        message: 'Novela creada correctamente.',
        duration: 2000,
        position: 'top',
        color: 'success'
      });

      router.push({name: 'DashboardNovels'}); // Redirige a la lista de novelas,  pero revisar en un futuro para vista de novelas creadas
      
      //Si no muestra un error
    }else {
      alert('Error al crear la novela: ' + response.message);
    }
  } catch (error:any) {
    console.error('Error al enviar el formulario:', error);
    
    //Si el error viene del backend y tiene información de validación
    if (error.response && error.response.data) {
    console.error('Respuesta completa de error del servidor (422):', error.response.data);
    
    if (error.response.data.errors) {
      //Si hay errores de validación específicos se muestran en un alert
      console.error('Errores de validación específicos:', error.response.data.errors);
      
      let validationMessages = [];
      for (const field in error.response.data.errors) {
        validationMessages.push(...error.response.data.errors[field]);
      }

      alert('Error de validación: ' + validationMessages.join('\n')); // Alerta para depurar
    } else {
      //Si hay otro tipo de error se muestra con una alerta
      alert('Error: ' + (error.response.data.message || 'Los datos enviados no son válidos.'));
    }
  } else {
    //Si no hay respuesta del servidor, se muestra esta alerta
    alert('Error de conexión o respuesta no recibida del servidor.');
  }
  } finally {
    isLoading.value = false; // Cambia el estado de carga a falso al finalizar


  }
 
  
  

  
}
</script>
