<script>
import DatasetService, { CLEANED, UNCLEANED } from '@/service/DatasetService';
import { axiosAPI, BACKEND_URL } from '@/axiosAPI';

export default {
    beforeRouteEnter(to, from, next) {
        new DatasetService().getDataset(to.params.id).then((data) => {
            next((vm) => vm.setData(data, to.params.id));
        });
    },
    data() {
        return {
            dataset: {},
            CLEANED,
            UNCLEANED,
            id: null,
            outliers: {},
            isCleaning: false
        };
    },
    methods: {
        setData(d, id) {
            this.dataset = d;
            this.id = id;
            const columns = d.data.columns;
            columns.forEach((col) => {
                this.outliers[col.column_name] = col.outliers;
            });
        },
        async Clean() {
            this.isCleaning = true;
            console.log(this.dataset);
            await axiosAPI.post(`/datasets/${this.id}/clean/`).then((data) => {
                this.dataset.status = CLEANED;
                this.dataset = data.data;
                this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Data Cleaned Successfully', life: 3000 });
                this.isCleaning = false;
            });
        },
        checkEmpty(data) {
            if (data == null || data === 'null' || data === '') return true;
            return false;
        },
        checkOutliers(data, columnName) {
            return this.outliers[columnName].includes(data);
        },
        getExportUrl() {
            return BACKEND_URL + this.dataset.url;
        }
    }
};
</script>
<template>
    <div class="card" v-if="dataset.data">
        <div class="flex mb-4 justify-content-between">
            <Toast />
            <h3>Dataset Details:</h3>
            <div class="flex gap-2">
                <Button v-if="dataset.status == UNCLEANED" label="Clean" @click="Clean" icon="pi pi-wrench" :loading="isCleaning"></Button>
                <div v-else>
                    <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
                    <Button type="button" label="View Applied Techniques" class="p-button-outlined" icon="pi pi-angle-down" @click="toggleMenu" style="width: auto" />
                </div>
                <a :href="getExportUrl()" download>
                    <Button label="Export" icon="pi pi-download" />
                </a>
            </div>
        </div>
        <div>
            <h3 class="mb-0">
                {{ dataset.file_name }}
                <Tag v-if="dataset.status == CLEANED" value="Primary" severity="success" style="vertical-align: middle"> Cleaned</Tag>
                <Tag v-else-if="dataset.status == UNCLEANED" value="Primary" severity="warning" style="vertical-align: middle">Uncleaned</Tag>
            </h3>
            <p class="text-600 text-xl mt-1 mb-3">
                {{
                    new Date(dataset.uploaded_at).toLocaleString('en-GB', {
                        hour12: true,
                        timeZone: 'Asia/Kuwait',
                        timeStyle: 'short',
                        dateStyle: 'medium'
                    })
                }}
            </p>
        </div>

        <DataTable class v-if="dataset.data" :value="dataset.data.data" :rows="10" :paginator="true" responsiveLayout="scroll" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
            <Column bodyStyle="padding:0; " :key="field.name" v-for="field in dataset.data.columns" :field="field.column_name" sortable headerStyle="width: 3rem">
                <template #header>
                    <div class="d-flex flex-col gap-6 w-full" style="min-width: 10rem">
                        <div class="mb-1 justify-content-center text-center">{{ field.column_name }}</div>
                        <ProgressBar :title="(100 - field.percent_missing).toFixed(2) + '%'" :value="(100 - field.percent_missing).toFixed(2)" :showValue="true" style="height: 1.5rem; width: 100%"></ProgressBar>
                    </div>
                </template>
                <template #body="{ data }">
                    <div v-if="checkEmpty(data[field.column_name])" class="cell empty" style="background-color: lightcoral; opacity: 60%" v-tooltip.top="'Missing Value'">
                        <p>{{ ' ' }}</p>
                    </div>
                    <div v-else-if="checkOutliers(data[field.column_name], field.column_name)" class="cell flex justify-content-center align-self-center" style="background-color: #F59E0B; opacity: 60% color:black" v-tooltip.top="'Outlier'">
                        <p class="text-center">{{ data[field.column_name] }}</p>
                    </div>
                    <p v-else class="text-center cell">{{ data[field.column_name] }}</p>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<style scoped lang="scss">
.cell {
    padding: 1rem;

    &.empty {
        height: 3.5rem;
        background-color: #41b783;
        font-weight: 700;
        color: #ffffff;
    }
}
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
