<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-card class="hero-banner">
      <!-- <ion-img :src="banner" alt="Banner"/> -->
       <div class="texto-banner">
         <ion-card-header>
          <ion-card-title>¡Bienvenido a Pixel Novels!</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>Descubre y lee novelas visuales únicas.</p>
          <ion-button class="customBtn" routerLink="/novels" expand="full">
            Explorar novelas
          </ion-button>
        </ion-card-content>
       </div>
      </ion-card>
<!-- Slides -->
      <Carousel :novels="novels.novels"/>  
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton} from '@ionic/vue';
import banner from '@/assets/images/banner.jpeg';
import Carousel from '@/components/Carousel.vue';
import type { INovel } from '@/interfaces/INovel';
import { ref, onMounted } from 'vue';
import NovelService from '@/services/NovelService';


const novels = ref<{ novels: INovel[] }>({ novels: [] });

onMounted(async () => {
  try {
    const response = await NovelService.obtenerNovelas();
    novels.value = response.data;
  } catch (error) {
    console.error('Error al obtener las novelas', error);  
    
  }
 
  console.log('Novelas obtenidas correctamente:', novels.value);
});
</script>

<style scoped>
.hero-banner {
  background-image: url('@/assets/images/banner.jpeg');
  background-size: cover;
  background-position: center;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 10px;
  padding: 20px;
}

.texto-banner {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  color: var(--ion-color-text);
}
p{
  font-size: 20px;
}

ion-card-title {
  color: var(--ion-color-text);
  font-size: 40px;
  font-weight: bold;
}

.customBtn {
  --color: var(--ion-color-text);
  --background: var(--ion-color-primary);
}
  
</style>