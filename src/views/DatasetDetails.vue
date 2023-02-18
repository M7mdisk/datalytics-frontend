<script>

import DatasetService, { CLEANED, UNCLEANED } from '@/service/DatasetService';
import { axiosAPI, BACKEND_URL } from '@/axiosAPI';

export default {
    beforeRouteEnter(to, from, next) {
        new DatasetService().getDataset(to.params.id).then((data) => {
             next((vm) =>  vm.setData(data, to.params.id));
        });
    },
    data() {
        return {
            dataset: {},
            CLEANED,
            UNCLEANED,
            id: null,
            outliers: {},
            isCleaning: false,
            overlayMenuItems: [
            {
                dropped_rows:{
                    name: 'Dropped Rows Count',
                    value: null
                },
                missing_values:{
                    name: 'Missing Values',
                    value: null
                },
                outlier_count:{
                    name: 'Outlier Count',
                    value: null
                },
                outlier_handeling:{
                    name: 'Outlier Handeling',
                    value: null
                }


            }
            ],
            nestedItems: [
                {
                    label: 'File',
                    icon: 'pi pi-fw pi-file',
                    items: [
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-plus',
                            items: [
                                {
                                    label: 'Bookmark',
                                    icon: 'pi pi-fw pi-bookmark'
                                },
                                {
                                    label: 'Video',
                                    icon: 'pi pi-fw pi-video'
                                }
                            ]
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-trash'
                        },
                        {
                            separator: true
                        },
                        {
                            label: 'Export',
                            icon: 'pi pi-fw pi-external-link'
                        }
                    ]
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Left',
                            icon: 'pi pi-fw pi-align-left'
                        },
                        {
                            label: 'Right',
                            icon: 'pi pi-fw pi-align-right'
                        },
                        {
                            label: 'Center',
                            icon: 'pi pi-fw pi-align-center'
                        },
                        {
                            label: 'Justify',
                            icon: 'pi pi-fw pi-align-justify'
                        },

                    ]
                },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-user-plus',

                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-user-minus',

                        },
                        {
                            label: 'Search',
                            icon: 'pi pi-fw pi-users',
                            items: [
                                {
                                    label: 'Filter',
                                    icon: 'pi pi-fw pi-filter',
                                    items: [
                                        {
                                            label: 'Print',
                                            icon: 'pi pi-fw pi-print'
                                        }
                                    ]
                                },
                                {
                                    icon: 'pi pi-fw pi-bars',
                                    label: 'List'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-calendar',
                    items: [
                        {
                            label: 'Edit',
                            icon: 'pi pi-fw pi-pencil',
                            items: [
                                {
                                    label: 'Save',
                                    icon: 'pi pi-fw pi-calendar-plus'
                                },
                                {
                                    label: 'Delete',
                                    icon: 'pi pi-fw pi-calendar-minus'
                                }
                            ]
                        },
                        {
                            label: 'Archieve',
                            icon: 'pi pi-fw pi-calendar-times',
                            items: [
                                {
                                    label: 'Remove',
                                    icon: 'pi pi-fw pi-calendar-minus'
                                }
                            ]
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'Quit',
                    icon: 'pi pi-fw pi-power-off'
                }
            ]


        };
    },
    methods: {
        setData(d, id) {
            this.dataset = d;
           this.setAplliedTech(d.applied_techniques)
            console.log(this.overlayMenuItems)

            this.id = id;
            const columns = d.data.columns;
            columns.forEach((col) => {
                this.outliers[col.column_name] = col.outliers;
            });
        },
        setAplliedTech(techs){
            for (const key in techs) {
                console.log(techs[key])
                this.overlayMenuItems[0][key].value = techs[key]
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
                this.setAplliedTech(data.data.applied_techniques)
                console.log(data.applied_techniques)
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
                <Button v-if="dataset.status == UNCLEANED" label="Clean" @click="Clean" icon="pi pi-wrench"
                    :loading="isCleaning"></Button>
                <div v-else>
                    <!-- <SplitButton label="Primary" :model="overlayMenuItems" class="p-button-raised p-button-text mb-2">
                    </SplitButton>

                    <Menu ref="op" :model="overlayMenuItems" :popup="true" />
                    <Button type="button" label="View Applied Techniques" class="p-button-outlined" icon="pi pi-angle-down"
                        @click="toggleMenu" style="width: auto" />
 -->



                    <Button type="button" icon="pi pi-angle-down"
                        label="View Applied Techniques" @click="toggle"
                        aria-haspopup="true" aria-controls="overlay_panel" class="p-button-outlined" />

                    <OverlayPanel ref="op" appendTo="body" :showCloseIcon="true" id="overlay_panel" style="width: 450px"
                        :breakpoints="{ '960px': '75vw' }">
                        <DataTable :value="overlayMenuItems" :reorderableColumn="true" v-model:selection="selectedProduct" selectionMode="single"
                              @rowSelect="onProductSelect" responsiveLayout="scroll">
                            <Column   field="name" header="Techniques Name"  style="width: 50%">
                            <template #body >
                                <div class="grid" v-for="tec in overlayMenuItems[0]">
                                    <div class="col-12 justify-content-center text-center"> <p class="text-primary" > {{ tec.name }}<hr></p> </div>
                                    <div class="col-12 justify-content-center text-center"> <p class="text"> {{ tec.value }}<hr></p> </div>
                               </div>

                            </template>
                            </Column>
                            <!-- <Column field="name" header=""  style="width: 50%">
                            <template #body >
                                
                            </template>
                            </Column> -->
                            
                        </DataTable>
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
                <Tag v-if="dataset.status == CLEANED" value="Primary" severity="success" style="vertical-align: middle">
                    Cleaned</Tag>
                <Tag v-else-if="dataset.status == UNCLEANED" value="Primary" severity="warning"
                    style="vertical-align: middle">Uncleaned</Tag>
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
        <div class="card col-2 mt-5 mb-5">
            <div class="grid m-2 " v-if="dataset.status == UNCLEANED">
                <div class="col-offset-0 justify-content-center">
                    <div class="flex align-items-center justify-content-center mr-2  border-round"
                        style="background-color: khaki; width: 1.5rem; height: 1.5rem">
                    </div>
                </div>
                <div class="col-offset-0 justify-content-center">
                    <p class="text-xl ">Outlier</p>
                </div>
            </div>
            <div class="grid m-2 " v-if="dataset.status == UNCLEANED">
                <div class="col-offset-0 justify-content-center">
                    <div class="flex align-items-center justify-content-center mr-2 border-round"
                        style="background-color: lightcoral; width: 1.5rem; height: 1.5rem">
                    </div>
                </div>
                <div class="col-offset-0 justify-content-center">
                    <p class="text-xl ">Missing value</p>
                </div>
            </div>
            <div class="grid m-2 " v-if="dataset.status == CLEANED">
                <div class="col-offset-0 justify-content-center">
                    <div class="flex align-items-center justify-content-center mr-2 border-round"
                        style="background-color: aquamarine; width: 1.5rem; height: 1.5rem">
                    </div>
                </div>
                <div class="col-offset-0 justify-content-center">
                    <p class="text-xl ">Edited value</p>
                </div>
            </div>
        </div>
        <DataTable class v-if="dataset.data" :value="dataset.data.data" :rows="20" :paginator="true"
            responsiveLayout="scroll"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">
            <Column bodyStyle="padding:0; " :key="field.name" v-for="field in dataset.data.columns"
                :field="field.column_name" sortable headerStyle="width: 3rem">
                <template #header>
                    <div class="d-flex flex-col gap-6 w-full" style="min-width: 10rem">
                        <div class="mb-1 justify-content-center text-center">{{ field.column_name }}</div>
                        <ProgressBar :title="(100 - field.percent_missing).toFixed(2) + '%'"
                            :value="(100 - field.percent_missing).toFixed(2)" :showValue="true"
                            style="height: 1.5rem; width: 100%"></ProgressBar>
                    </div>
                </template>
                <template #body="{ data }">
                    <div v-if="checkEmpty(data[field.column_name])" class="cell empty"
                        style="background-color: lightcoral; opacity: 60%" v-tooltip.top="'Missing Value'">
                        <p>{{ ' ' }}</p>
                    </div>
                    <div v-else-if="checkOutliers(data[field.column_name], field.column_name)"
                        class="cell flex justify-content-center align-self-center"
                        style="background-color:khaki ; opacity: 60% " v-tooltip.top="'Outlier'">
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
}</style>
