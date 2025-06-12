<template>
    <ion-content class="ion-padding">
        <ion-card class="tendencias">
            <ion-card-header>
            <ion-card-title>Tendencias</ion-card-title>
            </ion-card-header>
            <ion-card-content class="container">
            <swiper :initialSlide=0 :speed=400 :slidesPerView=1.2 :spaceBetween=10 :centeredSlides=true pager="true" class="container">
                <swiper-slide v-for="(novel, idx) in props.novels" :key="novel.id">
                    <ion-card :style="{ backgroundColor: colors[idx % colors.length] }">
                        <ion-card-header>
                        <ion-card-title>{{ novel.title }}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                        {{ novel.description }}
                        {{ novel.language }}
                        <img :src="novel.cover" alt="Cover">
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

<style scoped>
    ion-card-title{
        color: var(--ion-color-primary);
        font-weight: bold;
    }
    .tendencias{
        width: 80%;
        height: 100%;
        margin: 0 auto;
        border-radius: 18px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    }
    .container{
        height: 30rem;
    }
    ion-card-content img{
        padding: 16px;
        height: 20rem;
        width: 100%;
        border-radius: 20px;
    }
    ion-card-content{
        color: black;
    }
</style>