<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { axiosAPI } from '@/axiosAPI';
const route = useRoute();
const active = ref(0);

const TabMenu = ref([
    {
        label: 'Analytics',

    },
    {
        label: 'Use and Deploy',
     },
    
]);
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

// pi-chart-line
// categorical pi-tags
</script>
<template>
    <h3>Model Details:</h3>
    <div class="card justify-content-center">
        <TabMenu   :model="TabMenu" />



    </div>
    <div>
        <div class="card flex gap-3 justify-content-between">
            <div class="flex gap-3">
                <div><circle-progress :size="110" :percent="model.accuracy * 100 ? model.accuracy * 100 : 1"
                        :show-percent="true" :viewport="true" /></div>
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
            <div class="flex flex-column align-items-end justify-content-end">
                <p>
                    <span class="font-bold">Dataset:</span>
                    <i class="pi pi-file-excel mx-1"></i>
                    <span class="fnt-bold">{{ ' ' + model.dataset }}</span>
    <div class="card flex gap-3 justify-content-between">
        <div class="flex gap-3">
            <div><circle-progress :size="110" :percent="model.accuracy * 100 != 0 ? model.accuracy * 100 : 1" :show-percent="true" :viewport="true" /></div>
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
                <p>
                    <span class="font-bold">Predicting column:</span><span class="fnt-bold">{{ ' ' + model.target }}</span>
                </p>
            </div>
        </div>


        <!-- Top fields -->
        <div class="card  ">
            <h2>Top Fields</h2>
            <p class="text-color-secondary mb-1 text-lg ml-4">Fields ranked by their contribution to the prediction result
            </p>
            <div class="grid ml-5 mt-5 ">
                <div class="grid col-12">
                    <div class="col-1 mt-1">
                        <h4>Age</h4>
                    </div>
                    <div class="col align-items-center mt-2">
                        <ProgressBar class="text-color-secondary" :value="50"></ProgressBar>
                    </div>

                </div>
                <div class="grid col-12">
                    <div class="col-1 mt-1">
                        <h4>Age</h4>
                    </div>
                    <div class="col align-items-center mt-2">
                        <ProgressBar class="text-color-secondary" :value="30"></ProgressBar>
                    </div>

                </div>
                <div class="grid col-12">
                    <div class="col-1 mt-1">
                        <h4>Age</h4>
                    </div>
                    <div class="col align-items-center mt-2">
                        <ProgressBar class="text-color-secondary" :value="70"></ProgressBar>
                    </div>

                </div>


            </div>
        </div>
        <!-- segments -->

        <div class="gap-3 ">
            <div class="mb-6">
                <h2>Segments</h2>
                <p class="text-color-secondary mb-1 text-lg ">Sets of similar records in your dataset, grouped by outcome of
                    interest</p>
            </div>
            <div class="grid gap-5">
                <div class="card col"></div>
                <div class="card col"></div>

            </div>
        </div>

    </div>
</template>
<style lang="scss" >
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
    border-radius: 6px
}
</style>
