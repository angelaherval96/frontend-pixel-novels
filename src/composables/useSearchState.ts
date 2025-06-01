import { ref } from 'vue';

// Define una variable reactiva para el estado global de la búsqueda
// Será ref<string>('') porque siempre se espera un string
const searchInput = ref('');

// Función para actualizar el estado global de la búsqueda, recibe por parámetro el nuevo valor de la búsqueda y actualiza la variable reactiva searchInput
export function useSearchState() {
  const setSearchInput = (query: string) => {
    searchInput.value = query;
  };

  return {
    searchInput,
    setSearchInput,
  };
}