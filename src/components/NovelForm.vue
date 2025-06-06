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
            <IonInput label="URL de la portada" label-placement="floating" v-model="dataNovel.cover" type="url" placeholder="https://example.com/cover.jpg" required></IonInput>
          </IonItem>
        </IonList>

        <IonButton expand="block" type="submit" class="ion-margin-top" :disable="isLoading">
            <IonSpinner v-if="isLoading" name="dots"></IonSpinner>
            <span v-else>{{ textButton }}</span>
        </IonButton>
      </form>
</template>

<script setup lang="ts">
import { IonList, IonSelect, IonTextarea, IonItem, IonInput, IonSelectOption, IonButton, IonSpinner } from '@ionic/vue';
import { INovel } from '@/interfaces/INovel';
import { ref, watch } from 'vue';

//El componente padre pasará los datos iniciales y el texto del botón
const props = defineProps<{
  initialData: INovel;
  textButton?: string;
  isLoading?: boolean;
}>();

//El componente hijo emitirá un evento 'onSubmit' cuando el formulario se envíe
const emit = defineEmits<{
  (event: 'onSubmit', data: INovel): void;
}>();

const dataNovel = ref<INovel>({ ...props.initialData });

//Watch para actualizar y asegurar que si los datos iniciales cambias se actualicen
watch(() => props.initialData, (newData) => {
  dataNovel.value = { ...newData };
}, { deep: true, immediate: true }); // Asegura que se actualice inmediatamente

const sendForm = () => {
  // Emite el  evento con los datos de la novela
  emit('onSubmit', dataNovel.value);
};
</script>