<script setup>
import { ref, onMounted } from 'vue';

import { axiosAPI } from '@/axiosAPI';

const datasets = ref({})
const datasetsName = ref([])
const dropdownValue = ref('')
const  showClo = ref(false)
const datasetsCol = ref([])
const selectedCol = ref('')
const usedCols = ref('')
const modelName = ref('') 

onMounted(() => {
    axiosAPI.get('/datasets/').then((data)=>{
        datasets.value=data.data
        console.log(datasets.value[0].file_name)
        SetData(data.data)
    })
}); 

function SetData(data){
    for (const key in data) {
        datasetsName.value.push(data[key].file_name)
    }
    
}
function GetId(name){
 for (const key in datasets.value) {
    if(datasets.value[key].file_name==name){
        return datasets.value[key].id
    }
}}

async function getDatasetDetails(){
    const id = GetId(dropdownValue.value)
    axiosAPI.get(`/datasets/${id}`).then((data)=>{
        datasetsCol.value = data.data.columns
    console.log(datasetsCol.value)
    })
    showClo.value = true
}
</script>
<template>
    <h1>Create New Model:</h1>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card shadow-1" style="min-height: 800px">
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <h5>Model name</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-4">
                                <InputText type="text" v-model="modeleNmae"  placeholder="Model name"></InputText>
                            </div>
                        </div>

                        <h5 v-if="showClo">What do you want to predict?</h5>
                        <div v-if="showClo" class="grid formgrid">
                            <div class="col-12 mb-2">
                                <Dropdown v-model="selectedCol" :options="datasetsCol" optionLabel="name" placeholder="Select" />
                            </div>
                        </div>

                        <h5 v-if="showClo">What fields do you want to use in the prediction?</h5>
                        <div v-if="showClo" class="grid formgrid">
                            <div class="col-12 mb-2">
                                <MultiSelect v-model="usedCols" :options="datasetsCol" optionLabel="name" placeholder="Select Columns" :filter="true">
                                    <template #value="slotProps">
                                        <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                            <div>{{ option.name }}</div>
                                        </div>
                                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                                            <div class="p-1">Select Columns</div>
                                        </template>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <div>{{ slotProps.option.name }}</div>
                                        </div>
                                    </template>
                                </MultiSelect>
                                <!-- <Listbox v-model="listboxValue" :multiple="true" :options="listboxValues"
                                    optionLabel="name" :filter="true" /> -->
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <h5>Dataset</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-2">
                                <Dropdown v-model="dropdownValue" :options="datasetsName" @change="getDatasetDetails" placeholder="Select" />
                                <RouterLink to="/datasets/upload">
                                    <p class="ml-2 text-primary">Create New Dataset</p>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 h-22rem xs:h-3rem"></div>
                <div class="flex mr-6 justify-content-end">
                    <div><Button @click="upload" label="Create" style="left: 0; bottom: 0; position: relative" class="p-button-raised-rounded m-5 mr-2 mb-2 h-3rem" /></div>
                </div>
            </div>
        </div>
    </div>
</template>
