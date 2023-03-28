<script setup>
import { ref, onMounted, computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { axiosAPI } from '@/axiosAPI';
const { contextPath } = useLayout();
const router = useRouter();
const Regression = 'R';
const Categorical = 'C';
const searchTerm = ref('')

const SortType = ref(0)
const selectedCategory = ref('');
const sortOptions = ref([
    { name: 'Date Old to New', code: '1' },
    { name: 'Date New to Old', code: '0' }
]);
// const sortOptions = ref([
//     { name: "Numerical", code: 'R' },
//     { name: "Categorical", code: 'C' },

// ]);


const category = ref([
    { name: "Numerical", code: 'R' },
    { name: "Categorical", code: 'C' },

]);

const models = ref([]);
onMounted(() => {
    axiosAPI.get('/models/').then((data) => {
        models.value = data.data;
    });
});

function RandomColor() {
    const backgroundCss = `linear-gradient(0deg, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 10.1)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}) 0%, rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}) 100%)`;
    return backgroundCss;
}

function sortOrder() {
    if (SortType.value == 0) {
        SortType.value = 1

    }
    else {
        SortType.value = 0
    }
}



const sortedModels = computed(() => {
    let modelsToSort = [...models.value];

    if (selectedCategory.value) {
        modelsToSort = modelsToSort.filter(model => model.model_type === selectedCategory.value.code);
    }

    if (searchTerm.value) {
        modelsToSort = modelsToSort.filter(model => model.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
    }
    if (SortType.value == 0)
        return modelsToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else
        return modelsToSort.sort((b, a) => new Date(b.created_at) - new Date(a.created_at));
});




</script>

<template>
    <div class="flex m-5">
    <h1>ML Models:</h1>
</div>
<div class="card flex justify-content-between mr-8 gap-4 shadow-2">
    <div class="flex justify-content-between gap-4">
        <span class="block mt-2 md:mt-0 p-input-icon-left gap-8">
            <i class="pi pi-search" />
            <InputText v-model="searchTerm" placeholder="Search..." />
        </span>
        <Dropdown v-model="selectedCategory" :options="category" editable optionLabel="name"
            placeholder="Select model type" class="w-full md:w-14rem" />
    </div>
    
    <div class="flex justify-content-center mr-4">
        <Button style="background-color: transparent; color: gray;  border-color: transparent;" icon="pi pi-sort-alt"
            raised @click="sortOrder()" />
    </div>





</div>
<div class="grid mr-7">
    <div v-for="(d, index) in sortedModels" class="col-4">
        <Card class="shadow-4">
            <template #header>
                <div class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    :style="{ background: RandomColor(), height: '200px', clipPath: 'ellipse(170% 87% at 93% 13%)' }">
                    </div>
                </template>
            <template #content>
                <div class="ml-3">
                    <div class="text-left">
                        <div class="text-2xl font-bold ">Model {{ d.name }}</div>
                        <div class="mb-3 ml-1">
                            {{
                                new Date(d.created_at).toLocaleString('en-GB', {
                                    hour12: true,
                                    timeZone: 'Asia/Kuwait',
                                    timeStyle: 'short',
                                    dateStyle: 'medium'
                                })
                            }}
                        </div>
                    </div>

                    <div class="flex align-items-center justify-content-between">
                        <div class="flex align-items-center ml-3" v-if="d.model_type == Regression">
                            <i class="pi pi-chart-line" style="font-size: 1.5rem"></i>

                            <span class="font-semibold m-2">Numerical</span>
                        </div>
                            <div class="flex align-items-center ml-3" v-if="d.model_type == Categorical">
                                <i class="pi pi-tags" style="font-size: 1.5rem"></i>

                                <span severity="info" class="font-semibold m-2">Categorical</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex mt-3 gap-2 justify-content-end">
                        <router-link :to="`/models/${d.id}`">
                            <div><Button @click="" label="View" style="left: 0; bottom: 0; position: relative"
                                    class="p-button-raised-rounded m-5 mr-2 mb-2 h-3rem" /></div>
                        </router-link>

                    </div>
                </template>
            </Card>
            <!-- <div class="card m-1 border-1 surface-border shadow-1">
                                                    <div class="ml-3">
                                                        <div class="text-left">
                                                                <div class="text-2xl font-bold mt-8">Model {{ d.name }}</div>
                                                                <div class="mb-3 ml-1">
                                                                    {{
                                                                        new Date(d.created_at).toLocaleString('en-GB', {
                                                                            hour12: true,
                                                                            timeZone: 'Asia/Kuwait',
                                                                            timeStyle: 'short',
                                                                            dateStyle: 'medium'
                                                                        })
                                                                    }}
                                                                </div>
                                                            </div>

                                                            <div class="flex align-items-center justify-content-between">
                                                                <div class="flex align-items-center ml-3" v-if="d.model_type == Regression">
                                                                    <i class="pi pi-chart-line" style="font-size: 1.5rem"></i>

                                                                    <span class="font-semibold m-2">Numerical</span>
                                                                </div>
                                                                <div class="flex align-items-center ml-3" v-else>
                                                                    <i class="pi pi-tags" style="font-size: 1.5rem"></i>

                                                                    <span severity="info" class="font-semibold m-2">Categorical</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex mt-3 gap-2 justify-content-end">
                                                            <router-link :to="`/models/${d.id}`">
                                                                <div><Button @click="" label="View" style="left: 0; bottom: 0; position: relative"
                                                                        class="p-button-raised-rounded m-5 mr-2 mb-2 h-3rem" /></div>
                                                            </router-link>
                                                        </div>
                                                    </div> -->
        </div>
        <!-- <Card>
                                                    <template #header>
                                                        <div  class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                                                                style="height: 100px;"></div>

                                                    </template>
                                                    <template #content>
                
                                                    <router-link to="/ml-models/new-ml-model">
                                                        <div class="col-12 m-0   surface-border justify-content-center">
                                                            <div class="flex justify-content-center w-full h-full"
                                                                style="border: 2px dotted blue; border-style: dotted dotted dotted; border-radius: 15px">
                                                                <div class="m-8 justify-content-center">
                                                                    <div class="col justify-content-center mt-4 align-self-center">
                                                                        <Button icon="pi pi-plus"
                                                                            class="mb-3 p-button-rounded" iconPos="center" /></div>
                                                                    <P class="text-primary">Add New Model</P>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </router-link>
                                                    </template>
                                                </Card> -->
        <div class="col-4">
            <router-link to="/ml-models/new-ml-model">
                <div class="col-12 card m-1 border-1 surface-border justify-content-center w-full h-full">
                    <div class="flex justify-content-center w-full h-full"
                        style="border: 2px dotted blue; border-style: dotted dotted dotted; border-radius: 15px">
                        <div class="m-8 justify-content-center align-self-center">
                            <div class="flex justify-content-center align-self-center mt-4"><Button icon="pi pi-plus"
                                    class="mb-3 p-button-rounded" iconPos="center" /></div>
                            <P class="text-primary text-center">Add New Model</P>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped lang="scss">
.p-dataview-grid {
    background-color: #eff3f8;
}

@import '@/assets/demo/styles/badges.scss';
</style>
