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
const loading = ref(true)
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
const fetched = ref(false);
onMounted(() => {
    axiosAPI.get('/models/').then((data) => {
        loading.value = false;
        models.value = data.data.map(x => ({ ...x, color: RandomColor() }));
        fetched.value = true;
    });
});

function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const rand = mulberry32(124243715);

function RandomColor() {
    const backgroundCss = `linear-gradient(0deg, rgba(${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}, 0.2), rgba(${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}, 10.1)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}) 0%, rgb(${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}, ${Math.floor(rand() * 256)}) 100%)`;
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

    if (selectedCategory.value && selectedCategory.value.code != null) {
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

const noModelsCreated = computed(() => {
    return models.value.length == 0 && fetched.value
})



</script>

<template>
    <div class="flex  justify-content-between mb-3">
        <h2>ML Models:</h2>
        <router-link to="/ml-models/new-ml-model/">
            <Button label="New ML Model" icon="pi pi-plus"></Button>
        </router-link>
    </div>


    <Toolbar class="mx-1 mb-4">
        <template #start>
            <div class="col-12 lg:flex justify-content-between gap-3">
                <span class="block mt-2 md:mt-0 p-input-icon-left gap-8">
                    <i class="pi pi-search" />
                    <InputText v-model="searchTerm" placeholder="Search..." :disabled="noModelsCreated" />
                </span>
                <!-- <Dropdown v-model="selectedCategory" :options="category" show-clear optionLabel="name"
                            placeholder="Select model type" class="w-full md:w-14rem" :disabled="noModelsCreated" /> -->

                <Dropdown v-model="selectedCategory" :options="category" s optionLabel="name"
                    placeholder="Select model type" class="w-full md:w-14rem" :disabled="noModelsCreated">
                    <template #value="slotProps">
                        <div v-if="slotProps.value.code === 'C'" class=" flex align-items-center">
                            <i class="pi pi-tags m-1 mr-2" style="font-size: 1rem"></i>

                            <div>{{ slotProps.value.name }}</div>
                        </div>
                        <div v-if="slotProps.value.code === 'R'" class=" flex align-items-center">
                            <i class="pi pi-chart-line m-1 mr-2" style="font-size: 1rem"></i>

                            <div>{{ slotProps.value.name }}</div>
                        </div>
                    </template>
                    <template #option="slotProps">
                        <div v-if="slotProps.option.code === 'C'" class=" flex align-items-center">
                            <i class="pi pi-tags m-1 mr-2" style="font-size: 1rem"></i>

                            <div>{{ slotProps.option.name }}</div>
                        </div>
                        <div v-if="slotProps.option.code === 'R'" class=" flex align-items-center">
                            <i class="pi pi-chart-line m-1 mr-2" style="font-size: 1rem"></i>

                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
            </Dropdown>
        </div>



    </template>

    <template #end>
        <div class="flex justify-content-center ml-4 lg:mr-4">
            <Button class="p-button-rounded p-button-secondary p-button-outlined mr-2 mb-2" icon="pi pi-sort-alt" raised
                @click="sortOrder()" v-tooltip.bottom="'Sort'" :label="SortType == 0 ? 'Ascending' : 'Descending'"
                :disabled="noModelsCreated" />

        </div>
        </template>
    </Toolbar>

    <div class="grid col lg:mr-3  lg:ml-1 gap-5" v-if="loading">
        <div class="card col" style="width: 300px;" v-for="i in 12">
            <div class="border-round  border-1 surface-border p-3 surface-card p-0">

                <Skeleton clas width="290px" height="250px"></Skeleton>
                <div class="w-full md:w-6 p-3">
                    <Skeleton class="mb-2"></Skeleton>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>

                </div>
                <div class="flex justify-content-end mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>
    </div>



    <div class="grid lg:mr-3  lg:ml-1" v-else>
        <div v-for="(d, index) in sortedModels" class="col-12 xl:col-3 lg:col-4 md:col-6 sm:col-12">
            <!-- <Card class="shadow-4 "> -->
            <Card class="shadow-4 ">
                <template #header>
                    <div class="flex flex-column pt-1 px-1 lg:px-8 overflow-hidden"
                        :style="{ background: d.color, height: '180px', clipPath: 'ellipse(170% 87% at 93% 13%)' }">
                    </div>
                </template>
                <template #content>
                    <div class="ml-3">
                        <div class="text-left">
                            <div class="text-xl font-bold "> {{ d.name }}</div>
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
                            <div class="flex align-items-center ml-2" v-if="d.model_type == Regression">
                                <i class="pi pi-chart-line" style="font-size: 1.5rem"></i>

                                <span class="font-semibold m-2">Numerical</span>
                            </div>
                            <div class="flex align-items-center ml-2" v-if="d.model_type == Categorical">
                                <i class="pi pi-tags" style="font-size: 1.5rem"></i>

                                <span severity="info" class="font-semibold m-2">Categorical</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex mt-3 gap-2 justify-content-end">
                        <router-link :to="`/models/${d.id}`">
                            <div>

                                <Button icon="pi pi-arrow-right" iconPos="right" @click="" label="View"
                                    style="left: 0; bottom: 0; position: relative"
                                    class="p-button-rounded p-button-raised m-5 mr-2 mb-2 h-3rem" />
                            </div>
                        </router-link>

                    </div>
                </template>
            </Card>

        </div>
        <!-- 
                                                                                                                                <div class="col-12 lg:col-3 md:col-6">
                                                                                                                                    <router-link to="/ml-models/new-ml-model">
                                                                                                                                        <div class="col-12 card m-1 border-1 surface-border justify-content-center w-full h-full">
                                                                                                                                            <div class="flex justify-content-center w-full h-full"
                                                                                                                                                style="border: 2px dotted blue; border-style: dotted dotted dotted; border-radius: 15px">
                                                                                                                                                <div class="m-8 justify-content-center align-self-center">
                                                                                                                                                    <div class="flex justify-content-center align-self-center mt-4"><Button icon="pi pi-plus"
                                                                                                                                                            class="mb-3 p-button-rounded p-button-raised" iconPos="center" /></div>
                                                                                                                                                    <P class="text-primary text-center">Add New Model</P>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </router-link>
                                                                                                                                </div> -->


    </div>
    <div class="w-full m-0 card justify-content-center shadow-2 " v-if="noModelsCreated">

        <p class="text-center text-color-secondary font-bold">No ML models created yet</p>

    </div>
</template>

<style scoped lang="scss">
.p-dataview-grid {
    background-color: #eff3f8;
}

@import '@/assets/demo/styles/badges.scss';
</style>
