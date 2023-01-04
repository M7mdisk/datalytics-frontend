<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import Excel from 'exceljs';
import Papa from 'papaparse';
import { useRouter } from 'vue-router';
import { axiosAPI } from '@/axiosAPI';

const router = useRouter();
const toast = useToast();
const files = ref([]);
const Description = ref('');
let datasetflag = ref(false);

const onClear = (clear) => {
    clear();
    datasetflag.value = false;
};
const onRemoveTemplatingFile = (file, onFileRemove, index) => {
    files.value = [];
    onFileRemove(index);
    datasetflag.value = false;
};

const onSelectedFiles = (event) => {
    files.value = event.files;
};
const onRemoveUploadedFile = (removeUploadedFile, index) => {
    removeUploadedFile(index);
    files.value = [];
    datasetflag.value = false;
};

const uploadEvent = (callback) => {
    const wb = new Excel.Workbook();
    const reader = new FileReader();
    const file = files.value[0];
    let isString = true;
    if (file.type == 'text/csv') {
        reader.readAsText(file);
        reader.onload = function () {
            var data = Papa.parse(reader.result, { header: true });

            if (data.data.length >= 100 && data.meta.fields.length >= 4) {
                for (let d of data.meta.fields) {
                    if (!isNaN(d)) {
                        isString = false;
                        break;
                    }
                }
                if (isString) {
                    toast.add({ severity: 'success', summary: 'Success', detail: 'File satisfies requirements.', life: 3000 });
                    datasetflag.value = true;
                    callback();
                } else {
                    toast.add({ severity: 'error', summary: 'Denied', detail: 'First row must only contain column names.', life: 3000 });
                }
            } else {
                const msgs = [];
                if (data.data.length < 100) {
                    msgs.push('Not enough rows');
                }
                if (data.meta.fields.length < 4) {
                    msgs.push('not enough columns');
                }
                toast.add({ severity: 'error', summary: 'Denied', detail: msgs.join(''), life: 3000 });
            }
        };
    } else {
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer).then((workbook) => {
                if (workbook.worksheets[0].actualRowCount >= 100 && workbook.worksheets[0].actualColumnCount >= 4) {
                    const row = workbook.worksheets[0].getRow(0);
                    row.eachCell((cell) => {
                        const d = cell.value;
                        if (!isNaN(d)) {
                            isString = false;
                            return;
                        }
                    });
                    if (isString) {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'File satisfies requirements.', life: 3000 });
                        datasetflag.value = true;
                        callback();
                    } else {
                        toast.add({ severity: 'error', summary: 'Denied', detail: 'First row must only contain column names.', life: 3000 });
                    }
                } else {
                    const msgs = [];
                    if (workbook.worksheets[0].actualRowCount < 100) {
                        msgs.push('Not enough rows');
                    }
                    if (workbook.worksheets[0].actualColumnCount < 4) {
                        msgs.push('not enough columns');
                    }
                    toast.add({ severity: 'error', summary: 'Denied', detail: msgs.join(''), life: 3000 });
                }
            });
        };
    }
};

const onTemplatedUpload = () => {
    // toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const formatSize = (bytes) => {
    if (bytes === 0) {
        return '0 B';
    }

    let k = 1000,
        dm = 3,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
async function upload() {
    if (datasetflag.value) {
        var data = new FormData();
        data.append('file', files.value[0]);
        data.append('description', Description.value);
        axiosAPI
            .post('/datasets/', data)
            .then((response) => {
                router.push({ name: 'datasetdetails', params: { id: response.data.id } });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
</script>

<template>
    <Toast />
    <h3>Upload data:</h3>
    <div class="grid">
        <div class="col-3 px-0">
            <div class="card mb-0 h-full">
                <h5>Minimum Requirements:</h5>
                <ul>
                    <li>The file format must be '.xlsx' or '.csv'.</li>
                    <li>The first row must contain column names.</li>
                    <li>The dataset must have 100 rows.</li>
                    <li>The dataset must have at least 4 columns.</li>
                </ul>
            </div>
        </div>

        <div class="col-9">
            <div class="card flex flex-column gap-2">
                <FileUpload name="demo[]" @upload="onTemplatedUpload($event)" :fileLimit="1" :multiple="false" accept=".xlsx,.csv" :maxFileSize="100000000" @select="onSelectedFiles" class="h-screen">
                    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                            <div class="flex gap-2">
                                <Button @click="chooseCallback()" icon="pi pi-file" class="p-button-rounded" :disabled="datasetflag"></Button>
                                <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" class="p-button-rounded p-button-success" :disabled="!files || files.length === 0"></Button>
                                <Button @click="onClear(clearCallback)" icon="pi pi-times" class="p-button-rounded p-button-danger" :disabled="!files || files.length === 0"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                        <div v-if="files.length > 0">
                            <div class="flex flex-wrap p-0 sm:p-5 gap-1 align-items-center justify-content-center">
                                <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-5 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <!-- <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                    </div> -->
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Pending" severity="warning" />
                                    <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" class="p-button-outlined p-button-danger p-button-rounded" />
                                </div>
                            </div>
                        </div>

                        <div v-if="uploadedFiles.length > 0">
                            <div class="flex flex-wrap p-0 sm:p-5 gap-1 align-items-center justify-content-center">
                                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <!-- <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                    </div> -->
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Completed" class="mt-3" severity="success" />
                                    <Button icon="pi pi-times" @click="onRemoveUploadedFile(removeUploadedFileCallback, index)" class="p-button-outlined p-button-danger p-button-rounded" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex align-items-center justify-content-center flex-column">
                            <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                            <p class="mt-4 mb-0">Drag and drop files here to upload.</p>
                        </div>
                    </template>
                </FileUpload>
                <div class="mt-1">
                    <Textarea placeholder="Description..." :autoResize="false" rows="8" class="w-full" v-model="Description" />
                </div>
            </div>
        </div>
    </div>
    <div class="flex gap-2 justify-content-end">
        <div><Button @click="upload" label="Upload" :disabled="!datasetflag" style="left: 0; bottom: 0; position: relative" class="p-button-raised-rounded m-5 mr-2 mb-2 h-3rem" /></div>
    </div>
</template>
<style lang="scss" scoped>
::v-deep(.custom-progress-bar) {
    .p-progressbar-value {
        background-color: #f44336;
    }
}
ul {
    list-style-type: none;
    padding-left: 1px;
}

li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 10px;
}

li:before {
    position: absolute;
    top: 15%;
    left: 0;
    font-family: 'primeicons';
    content: '\e90a';
}
</style>
