<script>
import DatasetService, { CLEANED, UNCLEANED } from '@/service/DatasetService';
export default {
    beforeRouteEnter(to, from, next) {
        new DatasetService().getDataset(to.params.id).then((data) => {
            next((vm) => vm.setData(data));
        });
    },
    data() {
        return {
            dataset: {},
            CLEANED,
            UNCLEANED
        };
    },
    methods: {
        setData(d) {
            this.dataset = d;
        },
        exportDataset() {
            console.log('x');
        }
    }
};
</script>
<template>
    <div class="card" v-if="dataset.data">
        <div class="flex mb-4 justify-content-between">
            <h3>Dataset Details:</h3>
            <div class="flex gap-2">
                <Button v-if="dataset.status == UNCLEANED" label="Clean" icon="pi pi-wrench"></Button>
                <div v-else>
                    <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
                    <Button type="button" label="View Applied Techniques" class="p-button-outlined" icon="pi pi-angle-down" @click="toggleMenu" style="width: auto" />
                </div>
                <Button label="Export" icon="pi pi-download" @click="exportDataset"></Button>
            </div>
        </div>
        <div>
            <h3 class="mb-0">
                {{ dataset.file_name }}
                <Tag v-if="dataset.status == CLEANED" value="Primary" severity="success" style="vertical-align: middle">Cleaned</Tag>
                <Tag v-else-if="dataset.status == UNCLEANED" value="Primary" severity="warning" style="vertical-align: middle">Uncleaned</Tag>
            </h3>
            <p class="text-600 text-xl mt-1 mb-3">
                {{ new Date(dataset.uploaded_at).toLocaleString('en-GB', { hour12: true, timeZone: 'Asia/Kuwait', timeStyle: 'short', dateStyle: 'medium' }) }}
            </p>
        </div>

        <DataTable v-if="dataset.data" :value="dataset.data.data" :rows="8" responsiveLayout="scroll">
            <Column :key="field.name" v-for="field in dataset.data.columns" :field="field.column_name" headerStyle="width: 3rem">
                <template #header>
                    <div class="d-flex flex-col gap-6 w-full" style="min-width: 10rem">
                        <div class="mb-1">{{ field.column_name }}</div>
                        <ProgressBar :title="100 - field.percent_missing + '%'" :value="100 - field.percent_missing" :showValue="false" style="height: 1.5rem; width: 100%"></ProgressBar>
                    </div>
                </template>
            </Column>
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
