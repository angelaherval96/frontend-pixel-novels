<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding, formRegister">
      <ion-card class="register-card">
        <ion-card-header>
          <ion-card-title>Crear cuenta</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="register" class="formulario">
            <ion-item>
              <ion-label>Nombre de usuario</ion-label>
              <ion-input type="text" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Correo electrónico</ion-label>
              <ion-input type="email" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Contraseña</ion-label>
              <ion-input type="password" class="ion-padding" required></ion-input>
            </ion-item>
            <ion-button expand="full" type="submit" class="customBtn">Registrarse</ion-button>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput,IonButton, IonLabel } from '@ionic/vue';
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  role: '',
  password: ''
});

const register = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Registration successful:', data);
     
    } else {
      const errorData = await response.json();
      console.error('Registration failed:', errorData);
      
    }
  } catch (error) {
    console.error('Error during registration:', error);
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
