<script setup>
import { axiosAPI } from '@/axiosAPI';
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
const { layoutConfig, contextPath } = useLayout();
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const edit = ref({
    text: 'Edit Profile',
    flag: false,
    icon:'pi pi-user'
})


const isEmpty = ref({
    firstname: {
        class: 'w-full md:w-30rem ',
        msg: false,
        disabled: true,
        value: window.localStorage.getItem("Username").split(' ')[0]
    },

    lastname: {
        class: 'w-full md:w-30rem ',
        msg: false,
        disabled: true,
        value: window.localStorage.getItem("Username").split(' ')[1]
    },
    email: {
        class: 'w-full md:w-30rem ',
        msg: false,
        MSG: '',
        disabled: true,
    },
    password: {
        class: 'w-full md:w-30rem ',
        msg: false,
        disabled: true,
    }
});


function editText() {
    if (edit.value.text == 'Edit Profile') {
        edit.value.text = "Cancel"
        edit.value.flag = true;
        edit.value.icon = 'pi pi-user-edit'
    }
    else {
        edit.value.text = 'Edit Profile'
        edit.value.flag = false
        edit.value.icon = 'pi pi-user'
    }
}


function setUser(data) {
    window.localStorage.setItem('Username', data.first_name + ' ' + data.last_name);
    window.localStorage.setItem('Token', data.token);
}
function EditP() {
    editText()
    if (edit.value.flag) {
        isEmpty.value.email.disabled = false;
        isEmpty.value.firstname.disabled = false;
        isEmpty.value.lastname.disabled = false;
    }
    else {
        isEmpty.value.email.disabled = true;
        isEmpty.value.firstname.disabled = true;
        isEmpty.value.lastname.disabled = true;
    }

}

function checkData() {
    let flag = 0;
    if (firstname.value == '') {

        isEmpty.value.firstname.msg = true;
        isEmpty.value.firstname.class = 'w-full md:w-30rem p-invalid';
        flag = 1;
    } else {
        isEmpty.value.firstname.msg = false;
        isEmpty.value.firstname.class = 'w-full md:w-30rem ';
    }
    if (lastname.value == '') {
        isEmpty.value.lastname.msg = true;
        isEmpty.value.lastname.class = 'w-full md:w-30rem p-invalid';
        flag = 1;
    } else {
        isEmpty.value.lastname.msg = false;
        isEmpty.value.lastname.class = 'w-full md:w-30rem ';
    }
    if (password.value.length < 8) {
        isEmpty.value.password.msg = true;
        isEmpty.value.password.class = 'w-full md:w-30rem p-invalid';
        flag = 1;
    }
    if (password.value.length >= 8) {
        isEmpty.value.password.msg = false;
        isEmpty.value.password.class = 'w-full md:w-30rem ';
    }
    if (email.value == '') {
        isEmpty.value.email.msg = true;
        isEmpty.value.email.MSG = 'This field is required';
        isEmpty.value.email.class = 'w-full md:w-30rem p-invalid';
        flag = 1;
    } else {
        isEmpty.value.email.msg = false;
        isEmpty.value.email.class = 'w-full md:w-30rem ';
    }
    if (flag == 0) return true;
    else return false;
}
async function Edit() {

    const data = {
        email: email.value,
        password: password.value,
        first_name: firstname.value,
        last_name: lastname.value
    };

    if (checkData()) {
        const res = axiosAPI.post('/register/', data);
        res.then(async (resa) => {
            if (resa.status == 201) {
                router.push('/datasets');
                setUser(resa.data);
            }
        });
        res.catch((error) => {
            {
                isEmpty.value.email.msg = true;
                isEmpty.value.email.MSG = error.response.data?.email?.[0] ?? '';
            }
        });
    }
}
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-6 px-3 sm:px-8" style="border-radius: 53px">
                   
                    <div class="text-center mb-3"> 
                        <Avatar :icon="edit.icon" class="mr-2" size="xlarge" shape="circle"></Avatar>
                        <h2>Profile</h2>
                    </div>

                    <div>
                        <label for="firstname1" class="block text-900 text-l font-medium mb-1">First Name</label>
                        <InputText id="firstname1" type="text" placeholder="First Name" :class="isEmpty.firstname.class"
                            v-model="firstname" :disabled="isEmpty.firstname.disabled"
                            :value="isEmpty.firstname.value" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.firstname.msg">This field is required</InlineMessage>
                        </div>
                        <label for="lastname1" class="block text-900 text-l font-medium mb-1">Last Name</label>
                        <InputText id="lastname1" type="text" placeholder="Last Name" :class="isEmpty.lastname.class"
                            v-model="lastname" :disabled="isEmpty.lastname.disabled" :value="isEmpty.lastname.value" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.lastname.msg">This field is required</InlineMessage>
                        </div>
                        <label for="email1" class="block text-900 text-l font-medium mb-1">Email</label>

                        <InputText id="email1" type="text" placeholder="Email address" :class="isEmpty.email.class"
                            v-model="email" :disabled="isEmpty.email.disabled" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.email.msg">{{ isEmpty.email.MSG }}</InlineMessage>
                        </div>

                        <div class="flex align-items-center justify-content-end mb-5 gap-5">
                            <Button @click="EditP" :label="edit.text" class="p-button-text mr-2 mb-2" />
                        </div>

                        <Button @click="Edit" type="submit" label="Edit" class="w-full p-3 text-l"
                            v-if="edit.flag"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
