<template>
    <ion-card @click="goNovel()">
      <img :alt="props.novel.title" :src="props.novel.cover"/>
      <ion-card-header>
        <ion-card-title>{{ props.novel.title }}</ion-card-title>
        <ion-card-subtitle>{{ props.novel.language }}</ion-card-subtitle>
      </ion-card-header>
  
      <ion-card-content>
        {{ props.novel.description }}
      </ion-card-content>
    </ion-card>
    
</template>
  
<script lang="ts" setup>
    import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
    // import { defineProps } from 'vue';
    import type { INovel } from '@/interfaces/INovel';
    import router from '@/router';
    
    // const props = defineProps<INovel>();
    const props = defineProps<{ novel: INovel }>();

    const goNovel = () => {
       router.push({name:'NovelDetail', params:{id: props.novel.id}});
    }

</script>

<style scoped>
    ion-card{
        width: 300px;
    }
    ion-card:hover{
        cursor: pointer;
        scale: 1.01;
    }
</style>