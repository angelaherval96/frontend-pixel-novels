<template>
  
    <ion-footer>
      
    <ion-toolbar color="secondary" class="footerText">
      
        <ion-icon :icon="logoLinkedin"></ion-icon>
        <ion-icon :icon="logoGithub"></ion-icon>
        <ion-icon :icon="mailOutline"></ion-icon>
        <!-- <ion-icon name="logo-linkedin"></ion-icon> -->
      <ion-title>Ángela Hernández Valverde</ion-title>
  
    </ion-toolbar>
    
  </ion-footer>

</template>

<script lang="ts" setup>
import { IonFooter, IonTitle, IonToolbar } from '@ionic/vue';
import { logoLinkedin } from 'ionicons/icons';
import { logoGithub } from 'ionicons/icons';
import { mailOutline } from 'ionicons/icons';

</script>

<style scoped>
    .footerText{
        text-align: center;
    }
</style>