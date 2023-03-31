<script setup>
import { onMounted, ref } from 'vue';
import DatasetService, { CLEANED } from '../service/DatasetService';
import { humanFileSize } from '@/utils/common';
import { useRouter } from 'vue-router';
const datasets = ref(null);
const datasetService = new DatasetService();
const router = useRouter();
onMounted(() => {
    datasetService.getDatasets().then((data) => (datasets.value = data));
});

// function toCreateML(id){
//     router.push({ name: 'New Model', params: { id: id } });

// }

const expandedRows = ref([]);
</script>

<template>
    <div class="card shadow-1">
        <div class="flex mb-4 justify-content-between">
            <h3>Datasets:</h3>
            <router-link to="/datasets/upload">
                <Button label="Upload" icon="pi pi-upload"></Button>
            </router-link>
        </div>

        <DataTable :value="datasets" v-model:expandedRows="expandedRows" :rows="8" :paginator="true" responsiveLayout="scroll">
            <Column :expander="true" headerStyle="width: 3rem" />
            <Column  field="file_name" header="File Name" sortable class="hover:text-primary">
                <template #body="slotProps" >
                    <router-link :to="'/datasets/' + slotProps.data.id" class="text-primary no-underline">
                        {{ slotProps.data.file_name }}
                    </router-link>
                </template>
            </Column>
            <Column field="size" header="Size" sortable class="hover:text-primary">
                <template #body="slotProps">
                    {{ humanFileSize(slotProps.data.size) }}
                </template>
            </Column>
            <Column field="status" header="Status" sortable class="hover:text-primary">
                <template #body="slotProps">
                    <span :class="'dataset-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status == CLEANED ? 'Cleaned' : 'Uncleaned' }}</span>
                </template>
            </Column>
            <Column field="uploaded_at" header="Uploaded At" sortable class="hover:text-primary">
                <template #body="slotProps">
                    {{
                        new Date(slotProps.data.uploaded_at).toLocaleString('en-GB', {
                            hour12: true,
                            timeZone: 'Asia/Kuwait',
                            timeStyle: 'short',
                            dateStyle: 'medium'
                        })
                    }}
                </template>
            </Column>
            <Column  class="hover:text-primary">
                <template #header>
                    <div class="flex-1 text-center">Actions</div>
                </template>

                <template #body="{ data }">
                    <div class="flex-1 text-center">
                        <router-link :to="`/ml-models/new-ml-model/${data.id}`" v-if="data.status === 'C'">
                            <Button label="Create Model" icon="pi pi-plus" type="button" class="p-button-text"></Button>
                        </router-link>
                        <Button v-else label="Create Model" icon="pi pi-plus" type="button" class="p-button-text" disabled></Button>
                    </div>
                </template>
            </Column>
            <template #expansion="slotProps">{{ slotProps.data.description == '' ? 'No Description.' : 'Description: ' + slotProps.data.description }}</template>
            <template #empty>
                <div class="flex align-items-center justify-content-center">You have not uploaded any datasets</div>
            </template>
        </DataTable>
    </div>
</template>
<style scoped lang="scss">
.dataset-badge {
    border-radius: var(--border-radius);
    padding: 0.25em 0.5rem;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3px;
}

.dataset-badge {
    &.status-c {
        background: #c8e6c9;
        color: #256029;
    }

    &.status-u {
        background: #ffcdd2;
        color: #c63737;
    }
}
</style>
