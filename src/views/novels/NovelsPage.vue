<template>
  <IonContent class="ion-padding">
    <h1>Lista de Novelas</h1>
    <br>
    <div class="novelas">
      <CardNovel v-for="novel in novels.novels" :key="novel.id" :novel="novel" />
      
    </div>
    <div v-if="loading" class="cargandoNovelas">
      <p>Cargando novelas...</p>
    </div>
    <div v-else-if="!loading && novels.novels.length === 0" class="no-novels">
      <p>No hay novelas disponibles.</p>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import CardNovel from '@/components/CardNovel.vue';
import type { INovel } from '@/interfaces/INovel';
import NovelService from '@/services/NovelService';
import { IonContent } from '@ionic/vue';
import { ref, onMounted } from 'vue';


// Definición de la variable reactiva para almacenar las novelas
const novels = ref<{ novels: INovel[] }>({ novels: [] });

const loading = ref(true);

// Función para obtener las novelas utilizando el servicio NovelService
onMounted(async () => {
  loading.value = true; // Indica que se está cargando
  try {
    const response = await NovelService.obtenerNovelas();
    novels.value = response.data;
  } catch (error) {
    console.error('Error al obtener las novelas', error);  
  }
  // Indica que ha terminado de cargar y no hay novelas ni error
  console.log('Novelas obtenidas correctamente:', novels.value);
  loading.value = false; 
});

</script>
