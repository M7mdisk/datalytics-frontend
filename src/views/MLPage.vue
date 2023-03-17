<script setup>
import { ref, onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { axiosAPI } from '@/axiosAPI';
const { contextPath } = useLayout();
const router = useRouter();
const Regression = 'R';
const Categorical = 'C';

const dataviewValue = ref(null);
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);


const models = ref([]);
onMounted(() => {
    axiosAPI.get('/models/').then((data) => {
        models.value = data.data;
    });
});

function RandomColor() {
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const backgroundCss = `linear-gradient(0deg, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 10.1)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}) 0%, rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}) 100%)`;
    console.log(backgroundCss)
    return backgroundCss;
}
const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};
</script>

<template>
    <div class="flex m-5">
        <h1>ML Models:</h1>
    </div>

    <div class="grid mr-8">
        <div v-for="(d, index) in models" class="col-4">
            <Card>
                <template #header>
                    <div  class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                        :style="{background: RandomColor(), height:'200px', clipPath:'ellipse(170% 87% at 93% 13%)'}"></div>
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
                            <P class="text-primary">Add New Model</P>
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
