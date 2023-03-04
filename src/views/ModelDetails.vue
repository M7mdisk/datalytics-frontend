<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { axiosAPI } from '@/axiosAPI';
const route = useRoute();

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
        <div class="flex flex-column align-items-end justify-content-end">
            <p>
                <span class="font-bold">Dataset:</span>
                <i class="pi pi-file-excel mx-1"></i>
                <span class="fnt-bold">{{ ' ' + model.dataset }}</span>
            </p>
            <p>
                <span class="font-bold">Predicting column:</span><span class="fnt-bold">{{ ' ' + model.target }}</span>
            </p>
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
</style>
