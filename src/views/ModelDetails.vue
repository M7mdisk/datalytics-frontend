<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { axiosAPI } from '@/axiosAPI';
import { useField, useForm } from 'vee-validate';

const route = useRoute();
const active = ref(0);
const SelectedPage = ref('Analytics');
const topFields = ref([]);
const segments = ref({})
const segOutcome = ref([])
const TabMenu = ref([
    {
        label: 'Analytics'
    },
    {
        label: 'Use and Deploy'
    }
]);
const modelAcc = ref(0);
const TabMenu2 = ref(['Analytics', 'Use and Deploy']);
const model = ref({});
const maxWidth = ref(0);
onMounted(() => {
    axiosAPI.get(`/models/${route.params.id}`).then((res) => {
        model.value = res.data;
        featureImportance(res.data);
        getFeatures(res.data)
        modelAcc.value = Math.round(res.data.accuracy * 100, 2) % 100
        segments.value = res.data.segments
        if (res.data.segments.most) {
            segOutcome.value.push(res.data.segments.most.___prediction__val)
            segOutcome.value.push(res.data.segments.least.___prediction__val)
            delete res.data.segments.most.___prediction__val
            delete res.data.segments.least.___prediction__val
        }

        const featureElements = topFields.value
        for (let i = 0; i < featureElements.length; i++) {
            const featureWidth = featureElements[i][0].offsetWidth;
            maxWidth.value = Math.max(maxWidth.value, featureWidth);
        }

        // maxWidth.value = maxWidth;
        chartData.value = setChartData()

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

function accuracyColor(acc) {
    if (acc < 40)
        return '#FF0000'
    if (acc < 80)
        return '#FFA500'
    else return '#00FF00'

}

function featureImportance(model) {
    const total = Object.values(model.feature_importance).reduce((a, b) => a + Math.abs(b), 0)
    // console.log({ total })
    for (const key in model.feature_importance) {
        let value = Math.floor(Math.abs((model.feature_importance[key] / total) * 100), 3);
        if (value > 0) {
            topFields.value.push([key, value])
        }
    }
    topFields.value.sort(sortFunction)
    // console.log({ topFields: topFields.value })
}
function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}
function RandomColor() {
    const backgroundCss = `linear-gradient(30deg, rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 10.2), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 10.1)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}) 0%, rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}) 100%)`;
    return backgroundCss;
}


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







//use and deploy
const features = ref([])
const canPrecdict = computed(() => {
    return features.value.every(field => field.value !== '');
}); const sidebuttons = ref({
    b1: {
        class: "width: 269px; background-color: #D8EBFF; color: #0060FF; border-color: #0060FF;",

        selcted: true,
    },
    b2: {
        class: "width: 269px; background-color: white; color: #353535; border-color: #C8C4C4;",

        selcted: false,
    }
})

function getFeatures(model) {
    for (const key in model.features) {
        features.value.push({
            name: model.features[key].name,
            id: model.features[key].id,
            value: '',
        })
    }
}

function sideButton(num) {
    if (num == 1) {
        sidebuttons.value.b1.class = "width: 269px; background-color: #D8EBFF; color: #0060FF; border-color: #0060FF;"
        sidebuttons.value.b2.class = "width: 269px; background-color: white; color: #353535; border-color: #C8C4C4;"

        sidebuttons.value.b1.selcted = true;
        sidebuttons.value.b2.selcted = false;

    }
    if (num == 2) {
        sidebuttons.value.b2.class = "width: 269px; background-color: #D8EBFF; color: #0060FF; border-color: #0060FF;"
        sidebuttons.value.b1.class = "width: 269px; background-color: white; color: #353535; border-color: #C8C4C4;"

        sidebuttons.value.b2.selcted = true;
        sidebuttons.value.b1.selcted = false;
    }

}

async function predict() {
    for (const key in features.value) {
        console.log(features.value[key])
    }

}






//testing
const chartData = ref();
const chartOptions = ref({
    cutout: '60%'
});

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
        ]
    };
};

</script>
<template>
    <h2>Model Details:</h2>
    <div class="flex m-3 justify-content-center">
        <div>
            <TabMenu :model="TabMenu" />
            <SelectButton v-model="SelectedPage" :options="TabMenu2" aria-labelledby="basic" />
        </div>
    </div>
    <div v-if="SelectedPage === 'Analytics'">
        <div class="card flex gap-3 justify-content-between">
            <div class="flex gap-3">
                <!-- <div><circle-progress :style="{stroke : accuracyColor(model.accuracy)}" :size="110" :percent="model.accuracy * 100 ? model.accuracy * 100 : 1"
                                                                                                                                                                                                                                                                                                    :show-percent="true" :viewport="true" /></div> -->
                <Knob v-model="modelAcc" :size="120" valueTemplate="{value}%" readonly
                    :valueColor="accuracyColor(modelAcc)" />

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
                    <div class="text-color-secondary flex align-items-center gap-1 justify-content center text-lg"
                        v-if="model.model_type == 'C'">
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
                                <span class="font-bold">Predicting column:</span><span class="fnt-bold">{{ ' ' +
                                    model.target }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top fields -->
        <div class="card">
            <h4 class="mb-2">Top Fields</h4>
            <p class="text-color-secondary text-lg">Fields ranked by their contribution to the prediction result</p>
            <div class="grid">
                <div v-for="(feature, index) in topFields" :key="index"
                    class="grid w-full   ml-1 mt-3 justify-content-center align-items-center">
                    <div class=" col justify-content-start align-items-center"
                        :style="{ maxWidth: `${feature[0].offsetWidth}px` }">
                        <p class="text-lg">{{ feature[0] }}</p>
                    </div>
                    <div class="col-9 justify-content-start align-items-center flex-grow-1">
                        <ProgressBar :value="feature[1]" class="px-0">
                            {{ feature[1] }}%
                        </ProgressBar>
                    </div>
                </div>
            </div>
        </div>

        <!-- segments -->

        <div class="grid flex gap-3">
            <div class="ml-4 mt-1">
                <h4 class="mb-1">Segments:</h4>
                <p class="text-color-secondary mb-1 text-lg">Sets of similar records in your dataset, grouped by the
                    outcome
                    of interest</p>
            </div>

            <!-- Most -->
            <div class="grid col-12 ml-1 gap-3" v-if="model.model_type == 'R'">

                <div class="card col ">
                    <div class="grid justify-content-between gap-1">
                        <div class="col-1 " style="min-width: 50px;">
                            <Avatar
                                :style="{ backgroundColor: randomColor(), color: randomColor(), background: RandomColor() }"
                                size="large" shape="circle" icon="pi pi-star-fill" />
                        </div>
                        <div class="col">
                            <h5 class="mb-1">Segement 1</h5>
                            <p class="text-color-secondary">This segment has the <strong>
                                    highest
                                </strong>
                                values for <strong>

                                    {{ model.target }}
                                </strong>
                            </p>
                        </div>
                    </div>
                    <div class="grid justify-content-between">
                        <div class="col m-2">
                            <p class="text-lg">Outcome value:</p>
                            <h3 class="ml-2">{{ segOutcome[0].toFixed(2) }}</h3>
                        </div>
                        <div class="col-9 justify-content-end">
                            <DataTable :value="segments.most" stripedRows table-style="justify-content-center">
                                <Column field="field" header="Field">
                                    <template #body="slotProps">{{ slotProps.index }}
                                    </template>
                                </Column>
                                <Column field="value" header="Value">
                                    <template #body="slotProps">
                                        {{ slotProps.data }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

                <!-- least -->
                <div class="card col mb-5">
                    <div class="grid justify-content-between gap-1">
                        <div class="col-1 " style="min-width: 50px;">
                            <Avatar
                                :style="{ backgroundColor: randomColor(), color: randomColor(), background: RandomColor() }"
                                size="large" shape="circle" icon="pi pi-star-fill" />
                        </div>
                        <div class="col">
                            <h5 class="mb-1">Segement 2</h5>
                            <p class="text-color-secondary">This segment has the <strong>
                                    lowest
                                </strong>
                                values for <strong>

                                    {{ model.target }}
                                </strong>
                            </p>
                        </div>
                    </div>
                    <div class="grid justify-content-between">
                        <div class="col m-2">
                            <p class="text-lg">Outcome value:</p>
                            <h3 class="ml-2">{{ segOutcome[1].toFixed(2) }}</h3>
                        </div>
                        <div class="col-9 justify-content-end">
                            <DataTable :value="segments.least" stripedRows table-style="justify-content-center">
                                <Column field="field" header="Field">
                                    <template #body="slotProps">
                                        {{ slotProps.index }}
                                    </template>
                                </Column>
                                <Column field="value" header="Value">
                                    <template #body="slotProps">
                                        {{ slotProps.data }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </div>

               
            </div>


            <div class="grid col-12 ml-1 gap-3" v-else>
                <div class="card col m-0" v-for="(segmentObject, segmentName) in model.segments ?? {}">
                    <div class="grid justify-content-between gap-1">
                        <div class="col-1" style="min-width: 50px;">
                            <Avatar
                                :style="{ backgroundColor: RandomColor(), color: randomColor(), background: RandomColor() }"
                                size="large" shape="circle" icon="pi pi-star-fill" />
                        </div>
                        <div class="col">
                            <h5 class="mb-1">Segment "{{ segmentName }}" </h5>
                            <p class="text-color-secondary">This segment has the highest likelihood of <strong>{{
                                model.target }}</strong> being
                                <strong>{{ segmentName }}</strong>
                            </p>
                        </div>
                    </div>
                    <div class="grid justify-content-between">
                        <div class="col m-2">
                            <p class="text-lg">Outcome likelihood:</p>
                            <h3 class="ml-2">{{ Math.round(segmentObject.confidence * 100, 2) }}%</h3>
                            <!-- <h3 class="ml-2">{{ segmentObject.ac }}</h3> -->
                        </div>
                        <div class="col-9 justify-content-end">
                            <DataTable :value="segmentObject.values" stripedRows table-style="justify-content-center">
                                <Column field="field" header="Field">
                                    <template #body="slotProps">
                                        {{ slotProps.index }}
                                    </template>
                                </Column>
                                <Column field="value" header="Value">
                                    <template #body="slotProps">
                                        {{ typeof slotProps.data == "string" ? slotProps.data :
                                            Number(slotProps.data).toFixed(2) }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- use and deploy -->
    <div v-else>
        <div class="grid col m-3  mt-5 h-full justify-content-start">
            <div class="col-2 " style="min-width: 300px;">
                <Button class="mb-3" Rounded label="Use Here" :style="sidebuttons.b1.class" @click="sideButton(1)"></Button>
                <Button Rounded label="REST API" :style="sidebuttons.b2.class" @click="sideButton(2)"></Button>

            </div>
            <Divider layout="vertical" class=""></Divider>
            <div class="col mr-8">
                <div v-if="sidebuttons.b1.selcted" class="">
                    <h1>Use Here:</h1>
                    <p class="text-lg ml-2">Quickly get one-off predictions for new datapoints </p>
                    <div class="grid mt-5 mr-8 " >
                        <div class="col sm:col-12 lg:col-3 gap-2 grid " style="min-width: 250px;" v-for="(feature, index) in features">
                            <div class="col-12 pb-0 text-lg" >{{ feature.name }}</div>

                            <div class="ml-4" >
                                <InputText id="value" v-model="features[index].value" type="text" class="p-inputtext-sm" />

                            </div>
                        </div>


                    </div>
                    <div class="col"><Button :disabled="!canPrecdict" @click="predict()" label="Pridect!"></Button></div>
                    <Divider />
                    <div>
                        <div class="card">
                            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
                        </div>
                    </div>
                </div>
                <div v-if="sidebuttons.b2.selcted">
                    <h1>REST API:</h1>
                    <div class="col">
                        <p class="text-lg">Easily integrate the model into your system and setup real-time
                            automations with APIs.</p>
                    </div>
                    <div class="col">
                        <h5 class="bold"> Model ID</h5>
                        <p class="text-lg">2412413153515321351351351351531</p>
                    </div>
                    <div class="col">
                        <h5 class="bold"> API Key</h5>
                        <p class="text-lg">2412413153515321351351351351531</p>
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

.p-knob-value {
    color: aqua;
    background-color: brown;
}
</style>
