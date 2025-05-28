<template>
  <div class="novelas">
    <CardNovel v-for="novel in novels.novels" :key="novel.id" :novel="novel" />
    
  </div>
</template>

<script setup lang="ts">
import CardNovel from '@/components/CardNovel.vue';
import type { INovel } from '@/interfaces/INovel';
import { ref, onMounted } from 'vue';

const props = defineProps<{ novel: INovel }>();

onMounted(async () => {
  const response = await fetch('http://localhost:8000/api/novels');
  if (response.ok) {
    const result = await response.json();
    novels.value = result.data;
    console.log('Novels fetched successfully:', novels.value);
  } else {
    console.error('Failed to fetch novels');
  }
});
const novels = ref<{ novels: INovel[] }>({ novels: [] });
</script>
