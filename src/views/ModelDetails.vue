<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { axiosAPI } from '@/axiosAPI';
const route = useRoute();
const active = ref(0);
const SelectedPage = ref('Analytics');
const TabMenu = ref([
    {
        label: 'Analytics'
    },
    {
        label: 'Use and Deploy'
    }
]);
const TabMenu2 = ref(['Analytics', 'Use and Deploy']);
const model = ref({});
onMounted(() => {
    axiosAPI.get(`/models/${route.params.id}`).then((res) => {
        model.value = res.data;
    });
});
const model_names = {
    LINREG: 'Linear Regression',
    BR: 'Bayesian Ridge',
    SVR: 'Support Vector Regression',
    DTR: 'Decision Tree Regressor',
    LOGREG: 'Logistic Regression',
    SVC: 'Support Vector classifier',
    DTC: 'Decision Tree Classifier',
    RFC: 'Random Forest Classifier'
};

function randomColor() {
    // Generate random values for red, green, and blue
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    // Create a CSS color string from the random values
    var colorString = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

    // Return the CSS color string
    return colorString;
}

// pi-chart-line
// categorical pi-tags
</script>
<template>
    <h3>Model Details:</h3>
    <div class="flex m-3 justify-content-center">
        <div>
            <TabMenu :model="TabMenu" />
            <SelectButton v-model="SelectedPage" :options="TabMenu2" aria-labelledby="basic" />
        </div>
    </div>
    <div>
        <div class="card flex gap-3 justify-content-between">
            <div class="flex gap-3">
                <div><circle-progress :size="110" :percent="model.accuracy * 100 ? model.accuracy * 100 : 1" :show-percent="true" :viewport="true" /></div>
                <div>
                    <h3 class="mb-0">{{ model.name }}</h3>
                    <p class="text-color-secondary mb-1">
                        {{
                            new Date(model.created_at).toLocaleString('en-GB', {
                                hour12: true,
                                timeZone: 'Asia/Kuwait',
                                timeStyle: 'short',
                                dateStyle: 'medium'
                            })
                        }}
                    </p>
                    <div class="text-color-secondary flex align-items-center gap-1 justify-content center text-lg" v-if="model.model_type == 'C'">
                        <i class="pi pi-tags" style="font-size: 1.5rem"></i>
                        <p>Categorical</p>
                    </div>
                    <div class="text-color-secondary flex align-items-center gap-1 justify-content center text-lg" v-else>
                        <i class="pi pi-chart-line" style="font-size: 1.5rem"></i>
                        <p>Numerical</p>
                    </div>
                    <div class="text-xl mt-2">
                        Using <span class="font-bold">{{ model_names[model.selected_model_name] }}</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-column align-items-end justify-content-end gap-3">
                <div>
                    <span class="font-bold">Dataset:</span>
                    <i class="pi pi-file-excel mx-1" style="color: green"></i>
                    <span class="fnt-bold">{{ ' ' + model.dataset }}</span>
                </div>
                <div class="flex gap-3 justify-content-between">
                    <div class="flex gap-3">
                        <!-- <div><circle-progress :size="110" :percent="model.accuracy * 100 != 0 ? model.accuracy * 100 : 1"
                                                                        :show-percent="true" :viewport="true" /></div> -->
                        <div>
                            <p>
                                <span class="font-bold">Predicting column:</span><span class="fnt-bold">{{ ' ' + model.target }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top fields -->
        <div class="card">
            <h4 class="mb-1">Top Fields</h4>
            <p class="text-color-secondary text-lg">Fields ranked by their contribution to the prediction result</p>
            <div class="grid ml-1 mt-2 gap-2">
                <div class="grid col-12">
                    <div class="col-1">
                        <p class="text-lg">Age</p>
                    </div>
                    <div class="col align-items-center">
                        <ProgressBar class="text-color-secondary px-0" :value="50"></ProgressBar>
                    </div>
                </div>
            </div>
        </div>
        <!-- segments -->

        <div class="grid flex gap-3">
            <div class="ml-4 mt-1">
                <h4 class="mb-1">Segments:</h4>
                <p class="text-color-secondary mb-1 text-lg">Sets of similar records in your dataset, grouped by the outcome of interest</p>
            </div>

            <div class="grid col-12 ml-1 gap-3">
                <div class="card col m-0">
                    <div class="grid justify-content-between gap-1">
                        <div class="col-1">
                            <Avatar :style="{ backgroundColor: randomColor(), color: randomColor() }" size="large" shape="circle" icon="pi pi-star-fill" />
                        </div>
                        <div class="col">
                            <h5 class="mb-1">Segement 1</h5>
                            <p class="text-color-secondary">This segment has the highest likelihood of subscription being yes</p>
                        </div>
                    </div>
                    <div class="grid justify-content-between">
                        <div class="col m-2">
                            <p class="text-lg">Outcome likelihood:</p>
                            <h3 class="ml-2">88%</h3>
                        </div>
                        <div class="col-9 justify-content-end">
                            <DataTable :value="products" stripedRows table-style="justify-content-center">
                                <Column field="field" header="Field"></Column>
                                <Column field="value" header="Value"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
                <div class="card col">
                    <div class="grid justify-content-between gap-1">
                        <div class="col-1">
                            <Avatar :style="{ backgroundColor: randomColor(), color: randomColor() }" size="large" shape="circle" icon="pi pi-star-fill" />
                        </div>
                        <div class="col">
                            <h5 class="mb-1">Segement 1</h5>
                            <p class="text-color-secondary">This segment has the highest likelihood of subscription being yes</p>
                        </div>
                    </div>
                    <div class="grid justify-content-between">
                        <div class="col m-2">
                            <p class="text-lg">Outcome likelihood:</p>
                            <h4 class="ml-2">88%</h4>
                        </div>
                        <div class="col-9 justify-content-end">
                            <DataTable :value="products" stripedRows table-style="justify-content-center">
                                <Column field="field" header="Field"></Column>
                                <Column field="value" header="Value"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.current-counter {
    font-size: x-large;

    &::after {
        content: '%';
    }
}

.p-progressbar-value {
    font-size: large;
}

.p-progressbar-determinate {
    background-color: transparent;
}

.p-progressbar .p-progressbar-value {
    background-color: rgb(0, 122, 255);
    border-radius: 6px;
}

.p-avatar-icon {
    color: random($limit: 5);
}
</style>
