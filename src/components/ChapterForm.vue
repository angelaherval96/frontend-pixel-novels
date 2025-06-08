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

      <IonItem v-else-if="formData.content_type === 'image' || formData.content_type === 'video' || formData.content_type === 'comic_page'">
        <IonInput label="URL del Contenido Multimedia" label-placement="floating" v-model="formData.content" type="url" placeholder="https://example.com/imagen.jpg" required></IonInput>
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
  IonSelectOption, IonButton, IonSpinner 
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
  (event: 'onSubmit', formData: Partial<IChapter>): void;
}>();


// 'formData' es una copia reactiva de los datos iniciales. 
const formData = ref<Partial<IChapter>>({ ...props.initialData }); // Sintaxis de propagación para copiar los datos iniciales. Para que no se modifiquen las props del objeto padre directamente.


// Este 'watch' actualiza el formulario si los datos iniciales del padre cambian.
watch(() => props.initialData, (newData) => {
  formData.value = { ...newData };
}, { deep: true, immediate: true });

// Cuando el formulario se envía, emite el evento al padre.
const sendForm = () => {
  emit('onSubmit', formData.value);
};
</script>