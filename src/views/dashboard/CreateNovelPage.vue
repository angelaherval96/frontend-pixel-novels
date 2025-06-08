<template>
    <IonContent :fullscreen="true" class="ion-padding">
      <h1>Crear Nueva Novela</h1>
      <br>
      <NovelForm :initialData="dataNovel" textButton="Crear Novela" @onSubmit="sendForm"></NovelForm>
    </IonContent>
  
</template>

<script setup lang="ts">
import { IonContent } from '@ionic/vue';
import NovelService from '@/services/NovelService';
import { INovel } from '@/interfaces/INovel';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IApiResponse } from '@/interfaces/IApiResponse';
import NovelForm from '@/components/NovelForm.vue';
// Creamos una variable que almanecenará los datos de la novela
const dataNovel = ref<INovel>({
  title: '',
  description: '',
  language: '',
  cover: ''
});

const router = useRouter();
const isLoading = ref<boolean>(false); 

//Función que se ejecuta al enviar el formulario.
const sendForm = async (dataNovel: INovel)=> {
  //Se valida el título y la portada para que no estén vacíos
  if (!dataNovel.title || !dataNovel.cover){
    console.error('Error: El título y la portada son obligatorios.');
    return;
  }

  isLoading.value = true; // Cambia el estado de carga a verdadero
  try {
    //Llama al servicio para crear la novela, pasando los datos del formulario
    const response = await NovelService.createNovel(dataNovel);
    //Si la respuesta es correcta se limpia el formulario y se redirige a la lista de novelas
    if (response.success){
      alert('¡Novela creada con éxito!');
      console.log(response.message);
      router.push('/novels'); // Redirige a la lista de novelas,  pero revisar en un futuro para vista de novelas creadas
      dataNovel = {
        title: '',
        description: '',
        language: '',
        cover: ''
      };
      
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

  }
}
</script>
