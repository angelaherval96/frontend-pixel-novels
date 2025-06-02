<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding, formRegister">
      <ion-card class="register-card">
        <ion-card-header>
          <ion-card-title>Iniciar Sesión</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="makeLogin" class="formulario">
            <ion-item>
              <ion-label position="floating">Correo electrónico</ion-label>
              <ion-input v-model="form.email" type="email" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Contraseña</ion-label>
              <ion-input v-model="form.password" type="password" class="ion-padding" required></ion-input>
            </ion-item>

            <ion-button expand="full" type="submit" class="customBtn" :disabled="isLoading">
              <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
              <span v-else>Iniciar Sesión</span>
            </ion-button>

            <ion-text color="danger" v-if="errorMessage"><p>{{ errorMessage }}</p></ion-text>
          </form>
          <ion-text color="text"><p>¿No tienes cuenta? <a @click="goRegister()">Regístrate.</a></p></ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput,IonButton, IonLabel, IonText, IonSpinner } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
  email: '',
  password: ''
});

const goRegister = () => {
  router.push({name:'Register'});
}
  

const makeLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value= '';
    
    //Llama al método login del store.
    await authStore.login(form.value);

    //Redirige al usuario si hay redirect en la URL va ahí, si no va a Home
    const redirectPath = route.query.redirect as string | undefined;
    router.replace(redirectPath || { name: 'Home' });
    
  } catch (error:any) {
    //Muestra el mensaje de error del backend o uno genérico
    errorMessage.value = error.response?.data?.message || error.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'
  } finally{
    isLoading.value = false;
  }
};
</script>

<style scoped> 
  .formRegister {
    --background: url('@/assets/images/banner.jpeg');
    --background-size: cover;
    --background-position: center;
    --background-repeat: no-repeat;    
  }
  
  .register-card {
    max-width: 500px;
    margin: auto;
    margin-top: 50px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--ion-color-background);
   
  }

  .register-card ion-card-title {
    color: var(--ion-color-text);
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .formulario {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  ion-item{
    --background: var(--ion-color-background);
    border-radius: 10px;
    border: 3px solid var(--ion-color-medium);
    width: 100%;
    margin-bottom: 15px;
  }
  ion-input {
   
   margin: 15px 0;
  }
  ion-label {
    color: var(--ion-color-text);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
 
</style>
