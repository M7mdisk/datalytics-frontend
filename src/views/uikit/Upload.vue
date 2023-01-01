<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();
const uploadedFile = ref([]);
const files = ref([]);
const totalSize = ref(0);
const totalSizePercent = ref(0);

const onRemoveTemplatingFile = (file, onFileRemove, index) => {
    onFileRemove(index);
    totalSize.value -= parseInt(this.formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
}

const onClearTemplatingUpload = (clear) => {
    clear();
    totalSize.value = 0;
    totalSizePercent.value = 0;
}

const onSelectedFiles = (event) => {
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(this.formatSize(file.size));
    });
}

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

const uploadEvent = (callback) => {
    totalSizePercent.value = totalSize.value / 10;
    callback();
}

const onTemplatedUpload = () => {
    totalSize.value = 0;
    totalSizePercent.value = 0;
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

const formatSize = (bytes) => {
    if (bytes === 0) {
        return '0 B';
    }

    let k = 1000,
        dm = 3,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}




</script>




<template>
    <div class="formgrid">
        <div class="field col text-4xl"><strong>Upload data</strong> </div>
        <div class="formgrid grid">
            <div class="field col-12 md:col-4 ">

                <div class="card " style="height:auto;">
                    <h5>Panel</h5>
                    <Panel header="Header" :toggleable="true">
                        <p class="line-height-4 m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia deserunt mollit anim id est laborum.
                        </p>
                    </Panel>
                </div>
            </div>
            
            <div class="field col-12 md:col-8" style="height: max-content;">
                <FileUpload  name="demo[]" url="./upload.php" @upload="onTemplatedUpload($event)" :multiple="true"
                    accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles">
                    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                            <div class="flex gap-2">
                                <Button @click="chooseCallback()" icon="pi pi-images" class="p-button-rounded"></Button>
                                <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload"
                                    class="p-button-rounded p-button-success"
                                    :disabled="!files || files.length === 0"></Button>
                                <Button @click="clearCallback()" icon="pi pi-times"
                                    class="p-button-rounded p-button-danger"
                                    :disabled="!files || files.length === 0"></Button>
                            </div>
                            <ProgressBar :value="totalSizePercent" :showValue="false"
                                :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': (totalSizePercent > 100) }]">
                                <span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span>
                            </ProgressBar>
                            <Knob v-model="value7" :strokeWidth="5" />
                        </div>
                    </template>
                    <template   #content="{ files, uploadedFiles, removeUploadedFileCallback, fileRemoveCallback }">
                       
                        <div  v-if="files.length > 0">
                            <h5>Pending</h5>
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                    class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                            height="50" class="shadow-2" />
                                    </div>
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Pending" severity="warning" />
                                    <Button icon="pi pi-times"
                                        @click="onRemoveTemplatingFile(file, fileRemoveCallback, index)"
                                        class="p-button-outlined p-button-danger p-button-rounded" />
                                </div>
                            </div>
                        </div>

                        <div v-if="uploadedFiles.length > 0">
                            <h5>Completed</h5>
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
                                    class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                            height="50" class="shadow-2" />
                                    </div>
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Completed" class="mt-3" severity="success" />
                                    <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)"
                                        class="p-button-outlined p-button-danger p-button-rounded" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex align-items-center justify-content-center flex-column">
                            <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                            <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                        </div>
                    </template>
                </FileUpload>
            </div>
            <i></i>
            <div class="field col-12 md:col-12 justify-content-between">
                <div class=" flex-grow-1" style="margin-left:33%;">

                    <Fieldset legend="Description" :toggleable="true">
                        <Textarea placeholder="Your Message" :autoResize="false" rows="8" cols="140" />
                    </Fieldset>
                </div>
            </div>
        </div>
        <div   style="margin-left: 90%; ">
            <Button  label="Upload" class="p-button-rounded p-button-info m-5 mr-2 mb-2"  />
        </div>




    </div>
</template>
<style lang="scss" scoped>
::v-deep(.custom-progress-bar) {
    .p-progressbar-value {
        background-color: #f44336;
    }
}
</style>