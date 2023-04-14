<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { axiosAPI } from '@/axiosAPI';
import CodeBlock from '@/components/CodeBlock.vue';

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
const snippets = ref();
onBeforeMount(async () => {
    await axiosAPI.get(`/models/${route.params.id}`).then((res) => {
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
        console.log(res.data.features)

        // maxWidth.value = maxWidth;
        // chartData.value = setChartData(40,60)

    });
    await axiosAPI.get(`/models/${route.params.id}/snippet/`).then((res) => {
        console.log(res.data)
        snippets.value = res.data;
        allLang.value = getLang(res.data);
    })
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
    const colors = [
        "#FF0000", // 0-9%
        "#FF3300", // 10-19%
        "#FF6600", // 20-29%
        "#FF9900", // 30-39%
        "#FFCC00", // 40-49%
        "#FFFF00", // 50-59%
        "#CCFF00", // 60-69%
        "#99FF00", // 70-79%
        "#66FF00", // 80-89%
        "#008000", // 90-99%
        "#0033FF" // 100%
    ];

    // Ensure accuracy is within valid range
    acc = Math.min(Math.max(acc, 0), 100);

    // Calculate the index of the matching color in the array
    const colorIndex = Math.floor(acc / 10);

    return colors[colorIndex];
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
const result = ref('')
const loading = ref(false)
const predictColor = ref()
const prediction = computed(() => {
    if (!result.value) {
        return null;
    }

    const predictionData = result.value;
    const outcomePrecntage = predictionData.prediction_probabilities.Yes > predictionData.prediction_probabilities.No ?
        predictionData.prediction_probabilities.Yes * 100 :
        predictionData.prediction_probabilities.No * 100;

    return {
        ...predictionData,
        outcomePrecntage
    };
});
const predictFlag = ref(false)
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
        let feature = {
            name: model.features[key].name,
            id: model.features[key].id,
            value: '',
            values: model.features[key].values,
            options: []

        }

        // if (feature.values != null) {

        for (const f in feature.values) {
            feature.options.push({
                name: feature.values[f]
            })
        }
        features.value.push(feature)
        // }

    }
    console.log(features.value)
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
function getLabels() {
    let labels = []
    for (const key in result.value.prediction_probabilities) {
        labels.push(key)


    }
    return labels
}
function getValues() {
    let values = []
    for (const key in result.value.prediction_probabilities) {
        values.push(result.value.prediction_probabilities[key] * 100)


    }
    return values;

}
function getMaxConfedance() {
    let confedance = []
        ; let max = null
    for (const key in result.value.prediction_probabilities) {
        confedance.push(result.value.prediction_probabilities[key] * 100)
        if (result.value.prediction_probabilities[key] * 100 > max)
            max = result.value.prediction_probabilities[key] * 100


    }
    return max;
}
function getConfidance() {
    let confidance = []
    for (const key in result.value.prediction_probabilities) {
        confidance.push({
            confidance: result.value.prediction_probabilities[key] * 100,
            value: key

        });

    }
    console.log(confidance);

    return confidance;
}
function getpredictColor(data, predict) {
    console.log("colorrrr", [getLabels().indexOf(predict.prediction)])
    return data.datasets[0].backgroundColor[getLabels().indexOf(predict.prediction)]
}
async function predict() {
    loading.value = true
    let data = {}
    for (const key in features.value) {
        if (typeof features.value[key].value === 'object')
            data[features.value[key].name] = features.value[key].value.name
        else
            if (typeof Number(features.value[key].value) === 'number')
                data[features.value[key].name] = parseInt(features.value[key].value)
            else
                data[features.value[key].name] = features.value[key].value
    }
    console.log(data)

    await axiosAPI.post(`/models/${route.params.id}/predict/`, data).then(
        (res) => {
            loading.value = false
            console.log(res.data)
            predictFlag.value = true;
            result.value = res.data
            let lables = getLabels()
            let values = getValues()
            predictColor.value = getpredictColor(setChartData(values, lables), prediction.value)
            if (model.model_type === 'C') {
                if (data.data.prediction_probabilities.Yes > data.data.prediction_probabilities.No) prediction.value['outcomePrecntage'] = data.data.prediction_probabilities.Yes * 100
                else result.value['outcomePrecntage'] = data.data.prediction_probabilities.No * 100;
            }
            console.log(prediction)
            chartData.value = setChartData(values, lables)
            chartDataBar.value = setChartDataBar(values, lables)


        }
    )

}
//code
const code = ref(` const Prism = require('prismjs');

// The code snippet you want to highlight, as a string
const code = 'var data = 1;'';

// Returns a highlighted HTML string
const html = Prism.highlight(code, Prism.languages.javascript, 'javascript'); `)
function getLang(data) {
    let lang = []
    for (const key in data) {
        lang.push({ name: key })
    }
    console.log(lang)
    return lang
}
const allLang = ref([]);
const selectedLang = ref({name: 'javascript'})

//Chart
const chartData = ref();
const chartOptions = ref({
    cutout: '60%'
});
// bar 
const isBar = ref(false)
const chartDataBar = ref();
const chartOptionsBar = ref({
    scales: {
        y: {
            beginAtZero: true
        },
        x: {
            beginAtZero: true
        }
    }
});

const setChartDataBar = (data, labels) => {

    return {
        labels: labels,
        datasets: [
            {
                label: 'Confidence',
                data: data,
                backgroundColor: ['#E6331A', '#3B82F6', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#FF6633', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                hoverBackgroundColor: ['#E6331A', '#3B82F6', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#FF6633', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                borderWidth: 2
            }
        ]
    };
};




const setChartData = (data, labels) => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: ['#E6331A', '#3B82F6', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#FF6633', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                hoverBackgroundColor: ['#E6331A', '#3B82F6', '#FF33FF', '#FFFF99', '#00B3E6',
                    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                    '#FF99E6', '#CCFF1A', '#FF1A66', '#FF6633', '#33FFCC',
                    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
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
                <Knob v-model="modelAcc" :size="120" valueTemplate="{value}%" :valueColor="accuracyColor(modelAcc)"
                    readonly />

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
                                    <template #body="slotProps">
                                        {{ slotProps.index.substring(1) }}
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
                                        {{ slotProps.index.substring(1) }}
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
                                        {{ slotProps.index.substring(1) }}
                                    </template>
                                </Column>
                                <Column field="value" header="Value">
                                    <template #body="slotProps">
                                        {{
                                            typeof slotProps.data == "string" ? slotProps.data :
                                            Number(slotProps.data * 100).toFixed(2) }}
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
                    <h3>Use Here:</h3>
                    <p class="text-lg ">Quickly get one-off predictions for new datapoints </p>
                    <div class="grid mt-2 mr-8 ">
                        <div class="col sm:col-12 lg:col-3 gap-2 grid " style="min-width: 250px;"
                            v-for="(feature) in features">
                            <div class="col-12 pb-0 text-lg">{{ feature.name }}</div>

                            <div class="ml-4">
                                <InputText id="value" v-model="feature.value" type="text" class="p-inputtext-sm "
                                    style="width: 194px;" v-if="feature.options.length == 0" />
                                <Dropdown v-model="feature.value" :options="feature.options" optionLabel="name"
                                    placeholder="Select ..." class="w-full md:w-14rem" v-else />
                            </div>
                        </div>


                    </div>
                    <div class="col"><Button :disabled="!canPrecdict" @click="predict()" label="Pridect!"
                            :loading="loading"></Button></div>
                    <Divider />
                    <div>
                        <div class=" " v-if="predictFlag && model.model_type == 'C'">
                            <p class="text-2xl  text-color-secondary  flex gap-2 align-items-center"> Predicted value for
                                <span class="text-black-alpha-90 font-bold">{{ model.target }}</span> =
                            <h2 class="mt-2 " :style="{ color: predictColor }">{{ prediction.prediction }}
                            </h2>

                            <p class="text-lg align-items-baseline mt-2">({{ Number(getMaxConfedance()).toFixed(2)
                            }}% confidence)</p>
                            </p>
                            <div class="card grid">
                                <div class="col">
                                    <DataTable :value="getConfidance()" stripedRows class="p-datatable-lg"
                                        table-style="justify-content-center">
                                        <Column field="value" header="Value" sortable>

                                        </Column>
                                        <Column field="confidance" header="Confidence" sortable>
                                            <template #body="slotProps">
                                                {{
                                                    Number(slotProps.data.confidance).toFixed(2) }}%
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                                <div class="col-7  justify-content-center">
                                    <div v-if="getLabels().length > 5" class="flex  align-items-center gap-2">
                                        <Checkbox v-model="isBar" :binary="true" />
                                        <label class="ml-2 mb-2 text-xl">Bar Chart</label>
                                    </div>
                                    <Sidebar v-if="isBar" v-model:visible="isBar" :baseZIndex="1000" position="full">

                                        <Chart type="bar" :data="chartDataBar" :options="chartOptionsBar" />

                                    </Sidebar>

                                    <Chart v-else type="doughnut" :data="chartData" :options="chartOptions"
                                        class="col w-full " />
                                </div>
                            </div>
                        </div>
                        <!-- Numerical -->
                        <div class=" " v-if="predictFlag && model.model_type == 'R'">
                            <div class=" flex gap-3">
                                <p class="text-3xl text-color-secondary"> The Prediction of <span
                                        class="text-black-alpha-90 font-bold">{{ model.target }}</span>= </p>
                                <p class="text-primary font-bold  text-3xl">{{ Number(result.prediction).toFixed(2) }}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- REST API -->
                <div class="grid" v-if="sidebuttons.b2.selcted">
                    <h1>REST API:</h1>
                    <div class="col-12">
                        <p class="text-lg">Easily integrate the model into your system and setup real-time
                            automations with APIs.</p>
                    </div>
                    <div class="col-12">
                        <h5 class="bold"> Model ID</h5>
                        <p class="text-lg">2412413153515321351351351351531</p>
                    </div>
                    <div class="col-12">
                        <h5 class="bold"> API Key</h5>
                        <p class="text-lg">2412413153515321351351351351531</p>
                    </div>
                    <div class="col-12">
                        <Dropdown v-model="selectedLang" :options="allLang" optionLabel="name" placeholder="Select Language"
                            class="w-full md:w-14rem" />
                    </div>
                    <CodeBlock class="col" :code="snippets[selectedLang.name]" :language="selectedLang.name" />
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
