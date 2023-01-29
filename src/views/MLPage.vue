<script setup>
import { ref, onMounted } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
const { contextPath } = useLayout();
const router = useRouter();
const picklistValue = ref([
    [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' }
    ],
    []
]);

const orderlistValue = ref([
    { name: 'San Francisco', code: 'SF' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Berlin', code: 'BRL' },
    { name: 'Barcelona', code: 'BRC' },
    { name: 'Rome', code: 'RM' }
]);

const dataviewValue = ref(null);
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);

const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (dataviewValue.value = data));
});

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
       <h1>  ML Models:</h1>
    </div>

    <div class="grid mr-8">

        <div v-for="d in dataviewValue" class="col-4">

            <div class="card m-1 border-1 surface-border shadow-1">

                <div class="text-left">
                    <div class="text-2xl font-bold mt-8">Model {{ d.name }}</div>
                    <div class="mb-3">23/1/2023</div>

                </div>

                <div class="flex align-items-center justify-content-between">
                    <div class="flex align-items-center">
                        <i class="pi pi-tag mr-2"></i>
                        <span class="font-semibold">Regression</span>
                    </div>

                </div>

                <div class="flex mt-3 gap-2 justify-content-end">
                    <div><Button @click="" label="READY"
                            style="left: 0; bottom: 0; position: relative"
                            class="p-button-raised-rounded m-5 mr-2 mb-2 h-3rem" /></div>
                </div>
            </div>
        </div>
        <div class="col-4  ">
            <router-link to="/ml-models/new-ml-model">
            <div class=" col-12 card m-1 border-1 surface-border justify-content-center w-full h-full" >
                <div class=" flex justify-content-center w-full h-full"
                    style="border: 2px dotted blue; border-style: dotted dotted dotted;  border-radius: 15px;">
                    
                    <div class="  m-8  justify-content-center"><div class="flex justify-content-center mt-4"><Button icon="pi pi-plus" class=" mb-3 p-button-rounded" iconPos="center" /></div>
                    <P class="text-primary">Add New Model</P></div>
                </div>

            </div>
            </router-link>
        </div>

    </div>
</template>

<style scoped lang="scss">
.p-dataview-grid {
    background-color: #EFF3F8;
}


@import '@/assets/demo/styles/badges.scss';
</style>
