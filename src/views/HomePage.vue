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
          <ion-button color="primary">
            <router-link :to="{name: 'Novels'}">Explorar novelas</router-link>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonSlides, IonSlide } from '@ionic/vue';
import banner from '@/assets/images/banner.jpeg';
import Carousel from '@/components/Carousel.vue';

import { ref, onMounted } from 'vue';
const novels = ref<Novel[]>([])

onMounted(async () => {
  const response = await fetch('http://localhost:8000/api/novels'); // Replace with your API endpoint
  if (response.ok) {
    const result = await response.json();
    novels.value = result.data;
    console.log('Novels fetched successfully:', novels.value);
  } else {
    console.error('Failed to fetch novels');
  }
})
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

a{
  text-decoration: none;
  color: var(--ion-color-text);
}
  
</style>