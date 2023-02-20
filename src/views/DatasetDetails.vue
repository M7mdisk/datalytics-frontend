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
            is_filtering: false,
            dataset: {},
            CLEANED,
            UNCLEANED,
            id: null,
            outliers: {},
            changed: {},
            isCleaning: false,
            overlayMenuItems: {
                dropped_rows: {
                    name: 'Dropped Rows Count',
                    value: null
                },
                missing_values: {
                    name: 'Missing Values',
                    value: null
                },
                outlier_count: {
                    name: 'Outlier Count',
                    value: null
                },
                outlier_handeling: {
                    name: 'Outlier Handeling',
                    value: null
                }
            }
        };
    },
    computed: {
        filteredData() {
            let data = this.dataset.data.data;
            if (this.dataset.status == CLEANED && this.is_filtering) {
                const all_changed_rows = new Set([].concat(...Object.values(this.changed)));
                return data.filter((row) => all_changed_rows.has(row.index));
            }
            if (this.is_filtering) {
                return data.filter((row) => Object.keys(row).some((col_name) => this.checkOutliers(row[col_name], col_name) || this.checkEmpty(row[col_name])));
            }
            return data;
        }
    },
    methods: {
        setData(d, id) {
            this.dataset = d;
            this.id = id;
            const columns = d.data.columns;
            columns.forEach((col) => {
                this.outliers[col.column_name] = col.outliers;
            });
            if (d.applied_techniques != null) {
                this.setAppliedTechniques(d.applied_techniques);
            }
        },
        setAppliedTechniques(techs) {
            if (techs.modified) {
                this.changed = techs.modified;
            }
            for (const key in this.overlayMenuItems) {
                console.log(key, techs[key]);
                this.overlayMenuItems[key].value = techs[key];
            }
        },
        toggle(event) {
            this.$refs.op.toggle(event);
        },
        async Clean() {
            this.isCleaning = true;
            console.log(this.dataset);
            await axiosAPI.post(`/datasets/${this.id}/clean/`).then((data) => {
                this.dataset.status = CLEANED;
                this.dataset = data.data;
                this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Data Cleaned Successfully', life: 3000 });
                this.isCleaning = false;
                this.setAppliedTechniques(data.data.applied_techniques);
                console.log(data.applied_techniques);
            });
        },
        checkEmpty(data) {
            if (data == null || data === 'null' || data === '') return true;
            return false;
        },
        checkOutliers(data, columnName) {
            return this.outliers[columnName] && this.outliers[columnName].includes(data);
        },
        checkModified(data, columnName) {
            return this.changed[columnName] && this.changed[columnName].includes(data.index);
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
                    <!-- <SplitButton label="Primary" :model="overlayMenuItems" class="p-button-raised p-button-text mb-2">
                    </SplitButton>

                    <Menu ref="op" :model="overlayMenuItems" :popup="true" />
                    <Button type="button" label="View Applied Techniques" class="p-button-outlined" icon="pi pi-angle-down"
                        @click="toggleMenu" style="width: auto" />
 -->

                    <Button type="button" icon="pi pi-angle-down" label="View Applied Techniques" @click="toggle" aria-haspopup="true" aria-controls="overlay_panel" class="p-button-outlined" />

                    <OverlayPanel ref="op" appendTo="body" id="overlay_panel" style="width: 250px" :breakpoints="{ '960px': '75vw' }">
                        <div v-for="tec in Object.values(overlayMenuItems)" v-bind:key="tec.name">
                            <div class="flex justify-content-between">
                                <p class="text-primary font-bold">{{ tec.name }}: {{ ' ' }}</p>
                                <p class="text">{{ tec.value }}</p>
                            </div>
                        </div>
                    </OverlayPanel>
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
        <div class="flex flex-col justify-content-between align-items-end mb-2">
            <div class="flex flex-column" v-if="dataset.status == UNCLEANED">
                <div class="grid m-2">
                    <div class="col-offset-0 justify-content-center">
                        <div class="flex align-items-center justify-content-center mr-1 border-round" style="background-color: khaki; width: 1.5rem; height: 1.5rem"></div>
                    </div>
                    <div class="col-offset-0 justify-content-center">
                        <p class="text-base">Outlier</p>
                    </div>
                </div>
                <div class="grid mt-2 ml-2">
                    <div class="col-offset-0 justify-content-center">
                        <div class="flex align-items-center justify-content-center mr-1 border-round" style="background-color: lightcoral; width: 1.5rem; height: 1.5rem"></div>
                    </div>
                    <div class="col-offset-0 justify-content-center">
                        <p class="text-base">Missing value</p>
                    </div>
                </div>
            </div>
            <div class="grid mt-2 ml-2" v-if="dataset.status == CLEANED">
                <div class="col-offset-0 justify-content-center">
                    <div class="flex align-items-center justify-content-center mr-2 border-round" style="background-color: aquamarine; width: 1.5rem; height: 1.5rem"></div>
                </div>
                <div class="col-offset-0 justify-content-center">
                    <p class="text-base">Modified value</p>
                </div>
            </div>
            <div>
                <Checkbox v-model="is_filtering" inputId="binary" :binary="true" />
                <label for="binary">{{ dataset.status == CLEANED ? ' Only show modified values' : ' Only show highlighted values' }}</label>
            </div>
        </div>
        <DataTable class v-if="dataset.data" :value="filteredData" :rows="10" :paginator="true" responsiveLayout="scroll" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
            <Column bodyStyle="padding:0; " :key="field.name" v-for="field in dataset.data.columns" :field="field.column_name" sortable headerStyle="width: 3rem">
                <template #header>
                    <div class="d-flex flex-col gap-6 w-full" style="min-width: 10rem">
                        <div class="mb-1 justify-content-center text-center">{{ field.column_name }}</div>
                        <ProgressBar :title="(100 - field.percent_missing).toFixed(2) + '%'" :value="(100 - field.percent_missing).toFixed(2)" :showValue="true" style="height: 1.5rem; width: 100%"></ProgressBar>
                    </div>
                </template>
                <template #body="{ data }">
                    <div v-if="checkEmpty(data[field.column_name])" class="cell empty" style="background-color: lightcoral" v-tooltip.top="'Missing Value'">
                        <p>{{ ' ' }}</p>
                    </div>
                    <div v-else-if="checkModified(data, field.column_name)" class="cell flex justify-content-center align-self-center" style="background-color: aquamarine" v-tooltip.top="'Outlier'">
                        <p class="text-center text-black-alpha-90">{{ data[field.column_name] }}</p>
                    </div>
                    <div v-else-if="checkOutliers(data[field.column_name], field.column_name)" class="cell flex justify-content-center align-self-center" style="background-color: khaki" v-tooltip.top="'Outlier'">
                        <p class="text-center text-black-alpha-90">{{ data[field.column_name] }}</p>
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
