<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Panel de Control</IonTitle>
      </IonToolbar>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonButton v-for="page in visibleAppPages" :key="page.url" :router-link="page.url">
            <IonIcon :icon="page.icon" slot="start"></IonIcon>
            {{ page.title }}
          </IonButton>
        </IonButtons>

        <IonButtons slot="end">
          <IonButton @click="logout">
            <IonIcon :icon="exitOutline" slot="start"></IonIcon>
            Cerrar Sesión
          </IonButton>
        </IonButtons>

      </IonToolbar>
    </IonHeader>
    
    <router-view :key="$route.fullPath"/>
   
    
  </IonPage>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore'; 
import { bookOutline, peopleOutline, exitOutline } from 'ionicons/icons';

// Variable que define todas las páginas posibles del dashboard
const appPages = [
  {
    title: 'Gestionar Novelas',
    url: '/dashboard',
    icon: bookOutline,
    roles: ['creator', 'admin'] //  Visible para creadores y admins
  },
  {
    title: 'Gestión de Usuarios',
    url: '/dashboard/users',
    icon: peopleOutline,
    roles: ['admin'] // Visible solo para admins
  }
];

const authStore = useAuthStore();
const router = useRouter();

// Propiedad computada que filtra las páginas del menú según el rol del usuario autenticado.
const visibleAppPages = computed(() => {
  const userRole = authStore.user?.role;
  if (!userRole) return [];
  
  return appPages.filter(page => page.roles.includes(userRole));
});

// Función para cerrar sesión
const logout = () => {
  // Llama a la función de logout del store
  authStore.logout(); 
  // Redirige al login después de cerrar sesión
  router.push({ name: 'Login' });
};
</script>

<style scoped>
ion-menu ion-item {
  --padding-start: 20px;
  --padding-end: 20px;
  margin-bottom: 5px;
}
</style>
