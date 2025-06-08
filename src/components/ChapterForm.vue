<template>
  <form @submit.prevent="sendForm">
    <IonList>
      <IonItem>
        <IonInput label="Título del Capítulo" label-placement="floating" v-model="formData.title" type="text" required></IonInput>
      </IonItem>
      
      <IonItem>
        <IonInput label="Orden del Capítulo" label-placement="floating" v-model.number="formData.order" type="number" placeholder="Ej: 1" required></IonInput>
      </IonItem>

      <IonItem>
        <IonSelect label="Tipo de Contenido" label-placement="floating" v-model="formData.content_type" placeholder="Selecciona un tipo" interface="action-sheet">
          <IonSelectOption value="text">Texto</IonSelectOption>
          <IonSelectOption value="image">Imagen</IonSelectOption>
          <IonSelectOption value="comic_page">Página de Cómic</IonSelectOption>
          <IonSelectOption value="video">Vídeo</IonSelectOption>
        </IonSelect>
      </IonItem>
      
      <IonItem v-if="formData.content_type === 'text'">
        <IonTextarea label="Contenido del Capítulo" label-placement="floating" v-model="formData.content" :auto-grow="true" required></IonTextarea>
      </IonItem>

      <!-- Campor para imagen o vídeo con múltiple selección-->
      <IonItem v-else-if="['image', 'video', 'comic_page', 'image_sequence'].includes(formData.content_type || '')">">
        <IonLabel position="stacked">Archivos Multimedia</IonLabel>
        <input type="file" label="URL del Contenido Multimedia" @change="fileChange" label-placement="floating" placeholder="https://example.com/imagen.jpg" accept="image/*,video/mp4" required multiple></input>
        <!-- Muestra información sobre los archivos seleccionados y una vista previa si hay archivos -->
        <p v-if="selectedFiles.length > 0" class="fileInfo">{{ selectedFiles.length }} archivo(s) seleccionado(s).</p>
        <div v-if="selectedFiles.length > 0" class="previewContainer">
            <img v-for="(file, index) in selectedFiles" :key="index" :src="getFilePreviewUrl(file)" class="filePreview"/>
        </div>
      </IonItem>

    </IonList>

    <IonButton expand="block" type="submit" class="ion-margin-top" :disabled="isSubmitting">
      <IonSpinner v-if="isSubmitting" name="dots"></IonSpinner>
      <span v-else>{{ submitButtonText }}</span>
    </IonButton>
  </form>
</template>

<script setup lang="ts">
import { 
  IonList, IonItem, IonInput, IonTextarea, IonSelect, 
  IonSelectOption, IonButton, IonSpinner, 
  IonLabel
} from '@ionic/vue';
import { ref, watch } from 'vue';
import { IChapter } from '@/interfaces/IChapter'; 
import { defineProps, defineEmits, withDefaults } from 'vue';

// El componente padre le pasará los datos iniciales y el texto del botón.
const props = withDefaults(defineProps<{
  initialData: Partial<IChapter>; // Con Partial<IChapter> los datos iniciales puedan estar incompletos para edición.
  submitButtonText?: string;
  isSubmitting?: boolean;
}>(), {
  submitButtonText: 'Guardar', // Valor por defecto para el texto del botón
});


// El componente hijo emitirá un evento 'onSubmit' cuando el formulario se envíe.
const emit = defineEmits<{
  (event: 'onSubmit', eventData: {formData: Partial<IChapter>, files?: File[] | null}): void;
}>();


// 'formData' es una copia reactiva de los datos iniciales. 
const formData = ref<Partial<IChapter>>({ ...props.initialData }); // Sintaxis de propagación para copiar los datos iniciales. Para que no se modifiquen las props del objeto padre directamente.
const selectedFiles = ref<File[]>([]); // Para almacenar los archivos seleccionados.

//Función para manejar el cambio de archivo.
const fileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFiles.value = Array.from(input.files); // Convierte FileList a un array de File.
    
  } else {
    selectedFiles.value = []; // Si no hay archivo, resetea el valor.
    
  }
};

// Función para obtener la URL de vista previa del archivo seleccionado.
const getFilePreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
};

// Este 'watch' actualiza el formulario si los datos iniciales del padre cambian.
watch(() => props.initialData, (newData) => {
  formData.value = { ...newData };
  selectedFiles.value = []; // Resetea el archivo seleccionado al cambiar los datos iniciales.
}, { deep: true, immediate: true });

// Cuando el formulario se envía, emite el evento al padre.
const sendForm = () => {
  emit('onSubmit',{formData: formData.value, files: selectedFiles.value});
};
</script>

<style scoped>
.previewContainer {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
}
.filePreview {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
}
</style>