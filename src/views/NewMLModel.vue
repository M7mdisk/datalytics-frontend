<script setup>
import { ref, onMounted } from 'vue';
import CountryService from '@/service/CountryService';
import NodeService from '@/service/NodeService';

const floatValue = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const chipsValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref('#1976D2');
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const listboxValue = ref(null);
const dropdownValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);

const multiselectValue = ref(null);
const toggleValue = ref(false);
const selectButtonValue1 = ref(null);
const selectButtonValues1 = ref([{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]);
const selectButtonValue2 = ref(null);
const selectButtonValues2 = ref([{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]);
const knobValue = ref(50);
const inputGroupValue = ref(false);
const treeSelectNodes = ref(null);
const selectedNode = ref(null);
const countryService = new CountryService();
const nodeService = new NodeService();

onMounted(() => {
    countryService.getCountries().then((data) => (autoValue.value = data));
    nodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
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
                                <InputText type="text" placeholder="Model name"></InputText>
                            </div>
                        </div>

                        <h5>What do you want to predict?</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-2">
                                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
                            </div>
                        </div>

                        <h5>What fields do you want to use in the prediction?</h5>
                        <div class="grid formgrid">
                            <div class="col-12 mb-2">
                                <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Select Columns" :filter="true">
                                    <template #value="slotProps">
                                        <div class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2" v-for="option of slotProps.value" :key="option.code">
                                            <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
                                            <div>{{ option.name }}</div>
                                        </div>
                                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                                            <div class="p-1">Select Columns</div>
                                        </template>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex align-items-center">
                                            <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
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
                                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
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
