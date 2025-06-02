<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding, formRegister">
      <ion-card class="register-card">
        <ion-card-header>
          <ion-card-title>Crear cuenta</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="handleRegister" class="formulario">
            <ion-item>
              <ion-label>Nombre de usuario</ion-label>
              <ion-input v-model="form.name" type="text" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Correo electrónico</ion-label>
              <ion-input v-model="form.email" type="email" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Rol</ion-label>
              <ion-select v-model="form.role" required>
                <br>
                <ion-select-option value="user">Usuario</ion-select-option>
                <ion-select-option value="creator">Creador</ion-select-option>
                <ion-select-option value="admin">Admin</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Contraseña</ion-label>
              <br>
              <p class="password-rules">La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).</p>
              <ion-input v-model="form.password" type="password" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Confirmar Contraseña</ion-label>
              <ion-input v-model="form.password_confirmation" type="password" required></ion-input>
            </ion-item>
            
            <ion-button expand="full" type="submit" class="customBtn" :disabled="isLoading">
              <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
              <span v-else>Registrarse</span>
            </ion-button>
          
            <ion-text color="danger" v-if="errorMessage"><p>{{ errorMessage }}</p></ion-text>

            <ion-text color="text"><p>¿Ya tienes cuenta? <a @click="goLogin()">Iniciar sesión.</a></p></ion-text>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput,IonButton, IonLabel, IonSelect, IonSelectOption, IonText, IonSpinner, useKeyboard } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const route = useRoute(); //Para el redirect después del login
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref('');

const form = ref({
  name: '',
  email: '',
  role: 'user',
  password: '',
  password_confirmation: ''
});


const goLogin = () => {
  router.push({name:'Login'});
}
   

const handleRegister = async () => {
  isLoading.value = true; //Activa el spinner
  errorMessage.value = '';//Limpia mensajes de error anteriores

  try {
    console.log('Datos de registro enviados al store:', form.value);
    
    //Llama a la función register del store de autenticación, pasando los datos del formulario
    await authStore.register(form.value);

    console.log('Registro exitoso a través del store');

    //Si la URL tiene redirect redirige ahí, si no, redirige al home
    const redirectPath = route.query.redirect as string | undefined;
    router.replace(redirectPath || { name: 'Home'});

  } catch (error:any) {
    console.error('Error durante el registro (componente):', error);
    errorMessage.value = error.response?.data?.message || error.message || 'Error al registrar. Verifique los datos.';
  }finally {
    //Desactiva el spinner
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
  ion-select {
    margin: 15px 0;
  }
  a:hover {
    color: var(--ion-color-primary);
    text-decoration: underline;
  }
</style>
