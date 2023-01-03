<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/service/CustomerService';
import ProductService from '@/service/ProductService';
import { ref, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { DatasetsService } from '@/service/DatasetsService'
const { contextPath } = useLayout();

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);
const datasets = new DatasetsService()
const customerService = new CustomerService();
const productService = new ProductService();

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    loading2.value = false;
    datasets.getDatasets().then((data) => (customer3.value = data));


    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
const expandAll = () => {
    expandedRows.value = products.value.filter((p) => p.id);
};
const collapseAll = () => {
    expandedRows.value = null;
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const calculateCustomerTotal = (name) => {
    let total = 0;
    if (customer3.value) {
        for (let customer of customer3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Datasets</h5>
                <DataTable :value="products" v-model:expandedRows="expandedRows" dataKey="id" responsiveLayout="scroll">
                    <template #header>
                        <div>
                            <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2 mb-2" />
                            <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" class="mb-2" />
                        </div>
                    </template>
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image">
                        <template #body="slotProps">
                            <img :src="contextPath + 'demo/images/product/' + slotProps.data.image"
                                :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="category" header="Category" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.category) }}
                        </template>
                    </Column>
                    <Column field="rating" header="Reviews" :sortable="true">
                        <template #body="slotProps">
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" :sortable="true">
                        <template #body="slotProps">
                            <span
                                :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{
        slotProps.data.inventoryStatus
}}</span>
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <h5>Orders for {{ slotProps.data.name }}</h5>
                            <DataTable :value="slotProps.data.orders" responsiveLayout="scroll">
                                <Column field="id" header="Id" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.id }}
                                    </template>
                                </Column>
                                <Column field="customer" header="Customer" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.customer }}
                                    </template>
                                </Column>
                                <Column field="date" header="Date" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date }}
                                    </template>
                                </Column>
                                <Column field="amount" header="Amount" :sortable="true">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.amount) }}
                                    </template>
                                </Column>
                                <Column field="status" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span
                                            :class="'order-badge order-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{
        slotProps.data.status
                                            }}</span>
                                    </template>
                                </Column>
                                <Column headerStyle="width:4rem">
                                    <template #body>
                                        <Button icon="pi pi-search" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>


    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
