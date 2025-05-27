<template>
    <ion-content class="ion-padding">
        <ion-card class="tendencias">
            <ion-card-header>
            <ion-card-title>Tendencias</ion-card-title>
            </ion-card-header>
            <ion-card-content>
            <swiper :initialSlide=0 :speed=400 :slidesPerView=1.2 :spaceBetween=10 :centeredSlides=true pager="true">
                <swiper-slide v-for="(novel, idx) in props.novels" :key="novel.id">
                    <ion-card :style="{ backgroundColor: colors[idx % colors.length] }">
                        <ion-card-header>
                        <ion-card-title>{{ novel.title }}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                        {{ novel.description }}
                        {{ novel.language }}
                        <img :src="novel.cover" alt="Cover" style="width: 100%; height: auto; border-radius: 10px;">
                        </ion-card-content>
                    </ion-card>
                </swiper-slide>
            </swiper>
            </ion-card-content>
        </ion-card>
    </ion-content>
</template>

<script setup lang="ts">
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent} from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import type { INovel } from '@/interfaces/INovel';

const props = defineProps<{
     novels: INovel[];
}>();

// defineProps<{
//     novels: INovel[];
// }>();

// const slideOpts = {
//     initialSlide: 0,
//     speed: 400,
//     slidesPerView: 1.2,
//     spaceBetween: 10,
//     centeredSlides: true,
// };

const colors = ['#ffe082', '#b3e5fc', '#c8e6c9', '#f8bbd0'];
</script>