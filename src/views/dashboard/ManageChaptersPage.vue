<template>
    <IonPage>
        <IonContent :fullscreen="true" class="ion-padding ">
            <div class="container">
            <IonTitle class="ion-text-center ion-padding">Gestionar Capítulos de "{{ novel?.title }}"</IonTitle>
            <IonButton expand="block" color="medium" :router-link="`/dashboard/novel/${novelId}/chapters/create`">
                <IonIcon slot="icon-only" :icon="addCircleOutline"></IonIcon>
                Añadir Capítulo
            </IonButton>
            </div>
            

            <div v-if="isLoading" class="ion-text-center ion-padding-top">
                <IonSpinner name="crescent" class="ion-padding-top"></IonSpinner>
                <p class="ion-text-center">Cargando...</p>
            </div>

            <div v-if="error && !isLoading" class="ion-text-center ion-padding">
                <IonIcon :icon="alertCircleOutline" color="danger"></IonIcon>
                <p>Error al cargar los capítulos: {{ error }}</p>
                <IonButton @click="loadChapters">Reintentar</IonButton>

            </div>

            <div v-if="novel && !isLoading">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{{ novel.title }}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonButton fill="clear" size="small" :router-link="`/dashboard/novel/${novelId}/chapters/create`">
                            <IonIcon slot="start" :icon="addCircleOutline"></IonIcon>
                            Añadir Nuevo Capítulo
                        </IonButton>
                    </IonCardContent>
                </IonCard>

                <h3>Lista de Capítulos</h3>

                <div v-if="!novel.chapters || novel.chapters.length === 0" class="emptyChapters">
                    <IonIcon :icon="bookOutline" class="empty-icon"></IonIcon>
                    <p>No hay capítulos disponibles para esta novela.</p>
                </div>

                <IonList v-else>
                    <IonItemSliding v-for="chapter in novel.chapters" :key="chapter.id">
                        <IonItem :detail="false">
                            <IonLabel>
                                <h2>{{ chapter.order }}. {{ chapter.title }}</h2>
                                <p>Tipo: {{ chapter.content_type }}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItemOptions side="end">
                            <IonItemOption color="primary" @click="editChapter(chapter.id)">
                                <IonIcon :icon="createOutline"></IonIcon>
                                Editar
                            </IonItemOption>
                            <IonItemOption color="danger" @click="confirmDeleteChapter(chapter.id, chapter.title)">
                                <IonIcon :icon="trashOutline"></IonIcon>
                                Eliminar
                            </IonItemOption>
                        </IonItemOptions>
                       
                    </IonItemSliding>
                </IonList>

            </div>
            
        </IonContent>
    </IonPage>
  
</template>

<script setup lang="ts">
import { IonPage, IonTitle, IonContent, IonIcon, IonButton, IonSpinner, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonList, IonItemSliding, IonLabel, IonItemOptions, IonItem, IonItemOption, alertController, toastController } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { addCircleOutline, createOutline, trashOutline, bookOutline , alertCircleOutline} from 'ionicons/icons';
import { INovelDetail } from '@/interfaces/INovelDetail';
import NovelService from '@/services/NovelService';

const route = useRoute();
const router = useRouter();
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const novel = ref<INovelDetail | null>(null);
const novelId = Number(route.params.id);

//Función para cargar los detalles de la novela y sus capítulos
const loadChapters = async () => {
    isLoading.value = true;
    error.value = null;

    try {
        // Llama al servicio para obtener los detalles de la novela y sus capítulos
        const response = await NovelService.getNovelById(novelId.toString());
        if (response.success && response.data?.novel) {
            novel.value = response.data.novel;
        } else {
            throw new Error(response.message || "No se pudieron cargar los capítulos.");
        }
    } catch (error: any) {
        error.value = error.message || "Error al cargar los capítulos.";
    } finally {
        isLoading.value = false;
    }
}
// Función para editar un capítulo
const editChapter = (chapterId?: number) => {
    if (!chapterId) {
      return console.error("No se proporcionó un ID de capítulo para editar.");
    }
    
    router.push({name: 'UpdateChapterDashboard', params: { id: novelId, chapterId: chapterId }} );
}

//Función para confirmar o cancelar la eliminación de un capítulo
const confirmDeleteChapter = async (chapterId?: number, chapterTitle?: string | null) => {
    if (!chapterId){
        return console.error("No se proporcionó el ID del capítulo para eliminar.");
    }
    
    const alert = await alertController.create({
        header: 'Confirmar Eliminación',
        message: `¿Estás seguro de que quieres eliminar el capítulo "${chapterTitle}"? Esta acción no se puede deshacer.`,
        buttons: [
            { text: 'Cancelar', role: 'cancel'},
            { text: 'Eliminar', role: 'destructive', handler: () => deleteChapter(chapterId) },
        ],
    });
    await alert.present();
}
// Función para eliminar un capítulo
const deleteChapter = async (chapterId: number) => {
    if (!novel.value?.chapters) {
        console.error("No se pudo encontrar la novela para eliminar el capítulo.");
        return;
    }
    
    try {
        const response = await NovelService.deleteChapter(novelId.toString(), chapterId.toString());
        if (response.success) {
            // Actualiza la lista de capítulos eliminando el capítulo eliminado
            novel.value.chapters = novel.value.chapters?.filter(chapter => chapter.id !== chapterId);
            // Muestra un mensaje de éxito
            const toast = await toastController.create({
                message: 'Capítulo eliminado correctamente.',
                duration: 2000,
                color: 'success'
            });
            await toast.present();
        } else {
            throw new Error(response.message || "No se pudo eliminar el capítulo.");
        }
    } catch (error: any) {
        console.error("Error al eliminar el capítulo:", error);
        const toast = await toastController.create({
            message: `Error: ${error.message}`,
            duration: 3000,
            color: 'danger'
        });
        await toast.present();
    }
}

onMounted(() => {
   loadChapters();
});

</script>

<style scoped>
.container {
  padding-top: 30px;
  margin-top: 80px;
}
</style>