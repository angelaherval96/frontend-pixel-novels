<template>
    <IonContent :fullscreen="true" class="ion-padding">
      <h1>Editar Novela: {{ novelToEdit?.title }}</h1>
      <br>
      <div v-if="isLoading" class="ion-text-center ion-padding-top">
        <IonSpinner name="crescent"></IonSpinner>
        <p>Cargando los datos de la novela...</p>
      </div>
      <div v-if="error" class="ion-text-center ion-padding">
        <IonIcon :icon="alertCircleOutline" color="danger"></IonIcon>
        <p>Error al cargar los datos de la novela: {{ error }}</p>
        <IonButton @click="loadNovelData">Reintentar</IonButton>

      </div>
      <NovelForm v-if="novelToEdit && !isLoading" :initialData="novelToEdit" textButton="Actualizar Novela" :is-submitting="isSubmitting" @onSubmit="sendForm"></NovelForm>
    </IonContent>
  
</template>

<script setup lang="ts">
import { IonContent, IonSpinner, IonIcon, IonButton, toastController } from '@ionic/vue';
import NovelService from '@/services/NovelService';
import { INovel } from '@/interfaces/INovel';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IApiResponse } from '@/interfaces/IApiResponse';
import NovelForm from '@/components/NovelForm.vue';
import { alertCircleOutline } from 'ionicons/icons';
// Creamos una variable que almanecenará los datos de la novela
const novelToEdit = ref<INovel | null>(null);
  
const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(true); 
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);

//Obtiene el Id de la novela desde los parámetros de la ruta
const novelId = Number(route.params.id);

//Función para cargar los datos de la novela desde la API
const loadNovelData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await NovelService.getNovelById(novelId.toString());
    if (response.success && response.data?.novel) {
      novelToEdit.value = response.data.novel;
    } else {
      throw new Error(response.message || "No se pudieron cargar los datos de la novela.");
    }
  } catch (error:any) {
    error.value = error.message || "Error al cargar los datos de la novela.";
  }finally{
    isLoading.value = false;
  }
}

//Función que se ejecuta al enviar el formulario.
const sendForm = async (dataNovel: INovel)=> {
  isSubmitting.value = true; // Cambia el estado de envío a verdadero
  
  try {
    //Llama al servicio para actualizar la novela, pasando los datos del formulario
    const response = await NovelService.updateNovel(novelId.toString(), dataNovel);
    //Si la respuesta es correcta se limpia el formulario y se redirige a la lista de novelas
    if (response.success){
      const toast = await toastController.create({
        message: '¡Novela actualizada con éxito!',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
      console.log(response.message);
      router.push(`/dashboard/novels`); // Redirige a la página del dasboard de novelas
      novelToEdit.value = null; // Limpia los datos de la novela para evitar reenvíos accidentales
    
      //Si no muestra un error
    }else {
      alert('Error al actualizar la novela: ' + response.message);
    }
  } catch (error:any) {
    console.error('Error al enviar el formulario:', error);
    alert('Error al actualizar la novela: ' + (error.message || 'Los datos enviados no son válidos.'));
    
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
  }finally{
    isSubmitting.value = false; // Cambia el estado de envío a falso
  }
}

// Cargar los datos de la novela al montar el componente
onMounted(() => {
  if (novelId) {
    loadNovelData();
  } else {
    error.value = "No se encontró el ID de la novela en la ruta.";
    isLoading.value = false;
  }
});
</script>
