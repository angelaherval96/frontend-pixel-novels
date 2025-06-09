<template>
  <IonContent class="ion-padding">
    <h1>Lista de Novelas</h1>
    <br>
    <div class="novelas">
      <CardNovel v-for="novel in filterNovels" :key="novel.id" :novel="novel" />
      
    </div>
    <div v-if="loading" class="cargandoNovelas">
      <p>Cargando novelas...</p>
    </div>
    <div v-else-if="!loading && novels.novels.length === 0" class="noNovels">
      <p>No hay novelas disponibles.</p>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import CardNovel from '@/components/CardNovel.vue';
import type { INovel } from '@/interfaces/INovel';
import NovelService from '@/services/NovelService';
import { IonContent } from '@ionic/vue';
import { ref, onMounted, computed} from 'vue';
import { useSearchState } from '@/composables/useSearchState'; 

//Coge lo que el usuario está buscando desde el estado compartido
const { searchInput } = useSearchState();
// Definición de la variable reactiva para almacenar las novelas
const novels = ref<{ novels: INovel[] }>({ novels: [] });

const loading = ref(true);


// Computed property para filtrar las novelas según el texto de búsqueda, computed recalcula automáticamente el valor de filterNovels cuando novels o globalSearchQuery cambian
const filterNovels = computed(() => {
   // El valor de la query de búsqueda global se convierte a minúsculas y se recorta para evitar espacios al principio y al final
  const query = searchInput.value.toLowerCase().trim();

  //Array de novelas filtradas, se utiliza filter para iterar sobre cada novela y aplicar la lógica de filtrado
  const filtered = novels.value.novels.filter(novel => {
    // Si la novela no tiene título o el título no es una cadena, se ignora
    if (!novel.title || typeof novel.title !== 'string') {
      console.warn('Novela sin título o título no es string:', novel);
      return false;
    }
    // Convierte el título de la novela a minúsculas y verifica si incluye la query guardondolo en la variable boleana found
    const novelTitleLower = novel.title.toLowerCase();
    const found = novelTitleLower.includes(query); 
    console.log(`Evaluando: "${novel.title}" (query: "${query}") -> Coincide: ${found}`);
    return found;
  });

  // Imprime las novelas filtradas en la consola para depuración
  console.log('Novelas filtradas:', filtered.map(n => n.title));
  return filtered;
});




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
  console.log('Número de novelas cargadas:', novels.value.novels.length);
  loading.value = false; 
});

</script>

<style scoped>
.novelas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.cargandoNovelas {
  text-align: center;
  margin-top: 20px;
}

</style>