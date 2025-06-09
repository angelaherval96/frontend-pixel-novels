<template>
    <form @submit.prevent="sendForm">
        <IonList>
          <IonItem>
            <IonInput label="Título" label-placemen="floating" v-model="dataNovel.title" type="text" required></IonInput>
          </IonItem>

          <IonItem>
            <IonTextarea label="Descripción" label-placement="floating" v-model="dataNovel.description"></IonTextarea>
          </IonItem>

          <IonItem>
            <IonSelect label="Idioma" label-placement="floating" v-model="dataNovel.language" placeholder="Selecciona un idioma" interface="action-sheet">
              <IonSelectOption value="es">Español</IonSelectOption>
              <IonSelectOption value="en">Inglés</IonSelectOption>
              <IonSelectOption value="fr">Francés</IonSelectOption>
              <IonSelectOption value="de">Alemán</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Portada de la Novela</IonLabel>
            <div class="coverUpload">
              <img :src="imagenPreview" alt="Portada de la novela"/>
              <input type="file" accept="image/*" @change="coverFileUpload" class="inputCover" />
            </div>
          </IonItem>
        </IonList>

        <IonButton expand="block" type="submit" class="ion-margin-top" :disable="isLoading">
            <IonSpinner v-if="isLoading" name="dots"></IonSpinner>
            <span v-else>{{ textButton }}</span>
        </IonButton>
      </form>
</template>

<script setup lang="ts">
import { IonList, IonSelect, IonTextarea, IonItem, IonInput, IonSelectOption, IonButton, IonSpinner, IonLabel } from '@ionic/vue';
import { INovel } from '@/interfaces/INovel';
import { ref, watch, computed } from 'vue';

//El componente padre pasará los datos iniciales y el texto del botón
const props = defineProps<{
  initialData: INovel;
  textButton?: string;
  isLoading?: boolean;
}>();

//El componente hijo emitirá un evento 'onSubmit' cuando el formulario se envíe
const emit = defineEmits<{
  (event: 'onSubmit', eventData: {dataNovel: Partial<INovel>, coverFileUpload?: File | null} ): void;
}>();

const dataNovel = ref<Partial<INovel>>({ ...props.initialData });
const selectedCoverFile = ref<File | null>(null);

// Computed property para la vista previa de la imagen
const imagenPreview = computed(() => {
  //Si hay un archivo nuevo seleccionado, crea un objeto URL para mostrar la imagen
  if (selectedCoverFile.value) {
    return URL.createObjectURL(selectedCoverFile.value);
  }
  if (dataNovel.value.cover) {
    // Si ya hay una imagen cargada en dataNovel, la usa directamente
    return dataNovel.value.cover;
  }
  return ''; // Retorna una cadena vacía si no hay imagen
});

//Watch para actualizar y asegurar que si los datos iniciales cambias se actualicen
watch(() => props.initialData, (newData) => {
  dataNovel.value = { ...newData };
  selectedCoverFile.value = null; // Resetea el archivo seleccionado al cambiar los datos iniciales
}, { deep: true, immediate: true }); // Asegura que se actualice inmediatamente

//Función que se ejecuta cuando se selecciona un archivo de portada
const coverFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    // Si hay un archivo seleccionado, lo asigna a selectedCoverFile
    selectedCoverFile.value = input.files[0];
  } else {
    selectedCoverFile.value = null;
  }
};

const sendForm = () => {
  // Emite el  evento con los datos de la novela
  emit('onSubmit', {dataNovel: dataNovel.value, coverFileUpload: selectedCoverFile.value });
};
</script>

<style scoped>
  .coverUpload {
    width: 100%;
    margin-top: 10px;
  }
  .coverUpload img {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
  }
  .inputCover {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
  }
</style>