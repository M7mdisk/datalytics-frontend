<script setup>
import { axiosAPI } from '@/axiosAPI';
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const { layoutConfig, contextPath } = useLayout();
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const Newpassword = ref('');
const router = useRouter();
const edit = ref({
    text: 'Edit Profile',
    flag: false,
    icon: 'pi pi-user'
})
const editPassword = ref({
    flag: false
})


const isEmpty = ref({
    firstname: {
        class: 'w-full md:w-30rem ',
        msg: false,
        disabled: true,
        value: firstname.value
    },

    lastname: {
        class: 'w-full md:w-30rem ',
        msg: false,
        disabled: true,
        value: lastname.value
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
    },
    Newpassword: {
        class: 'w-full md:w-30rem ',
        msg: false,
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
async function getProfile() {
    const Profile = null
    axiosAPI.get('/user/').then((data) => {
        Profile = data.data
        return Profile
    })
}
onBeforeMount(async () => {
    await axiosAPI.get('/user/').then((data) => {

        firstname.value = data.data.first_name
        lastname.value = data.data.last_name
        email.value = data.data.email
    })

})

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

function checkData(f) {
    let flag = 0;
    // for edit password
    if (f == 1) {
        if (password.value.length < 8 || password.value == '') {
            isEmpty.value.password.msg = true;
            isEmpty.value.password.class = 'w-full md:w-30rem p-invalid';
            flag = 1;
        }
        if (password.value.length >= 8) {
            isEmpty.value.password.msg = false;
            isEmpty.value.password.class = 'w-full md:w-30rem ';
        }
        if (Newpassword.value != password.value && password.value.length >= 8) {
            isEmpty.value.Newpassword.msg = true;
            isEmpty.value.Newpassword.class = 'w-full md:w-30rem p-invalid';
            flag = 1;
        }
        if (Newpassword.value === password.value) {
            isEmpty.value.Newpassword.msg = false;
            isEmpty.value.Newpassword.class = 'w-full md:w-30rem ';
        }
    }
    // for edit profile

    else {
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

        if (email.value == '') {
            isEmpty.value.email.msg = true;
            isEmpty.value.email.MSG = 'This field is required';
            isEmpty.value.email.class = 'w-full md:w-30rem p-invalid';
            flag = 1;
        } else {
            isEmpty.value.email.msg = false;
            isEmpty.value.email.class = 'w-full md:w-30rem ';
        }
    }
    if (flag == 0) return true;
    else return false;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function Edit() {

    const data = {
        email: email.value,
        first_name: firstname.value,
        last_name: lastname.value
    };

    if (checkData(0)) {
        const res = axiosAPI.patch('/user/', data);
        res.then(async (resa) => {
            if (resa.status == 200) {
                
                toast.add({ severity: 'success', summary: 'Success', detail: 'Profile edited successfully', life: 3000 });
                await delay(1000)
                router.push('/');
            }
        });
    }
}


async function Change() {

const data = {
    new_password: password.value,

};

if (checkData(1)) {
    const res = axiosAPI.post('/user/reset_password/', data);
    res.then(async (resa) => {
        if (resa.status == 200) {
            
            toast.add({ severity: 'success', summary: 'Success', detail: 'Password Changed successfully', life: 3000 });
            await delay(1000)
            router.push('/');
        }
    });
}
}

</script>

<template>
 <Toast />
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

                    <div v-if="!editPassword.flag">
                        <label for="firstname1" class="block text-900 text-l font-medium mb-1">First Name</label>
                        <InputText id="firstname1" type="text" placeholder="First Name" :class="isEmpty.firstname.class"
                            v-model="firstname" :disabled="isEmpty.firstname.disabled" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.firstname.msg">This field is required</InlineMessage>
                        </div>
                        <label for="lastname1" class="block text-900 text-l font-medium mb-1">Last Name</label>
                        <InputText id="lastname1" type="text" placeholder="Last Name" :class="isEmpty.lastname.class"
                            v-model="lastname" :disabled="isEmpty.lastname.disabled" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.lastname.msg">This field is required</InlineMessage>
                        </div>
                        <label for="email1" class="block text-900 text-l font-medium mb-1">Email</label>

                        <InputText id="email1" type="text" placeholder="Email address" :class="isEmpty.email.class"
                            v-model="email" :disabled="isEmpty.email.disabled" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.email.msg">{{ isEmpty.email.MSG }}</InlineMessage>
                        </div>
                        <div class="grid">
                            <div class="col-8 align-items-start justify-content-end ">
                                <Button @click="EditP" :label="edit.text" class="p-button-text mr-2 mb-2" />
                            </div>
                            <div class="col-4 align-items-start justify-content-start ">
                                <Button @click="editPassword.flag = !editPassword.flag" label="Change Password"
                                    class="p-button-text mr-2 mb-2" />
                            </div>
                        </div>
                        <Button @click="Edit" type="submit" label="Edit" class="w-full p-3 text-l"
                            v-if="edit.flag"></Button>
                    </div>


                    <!-- reset pass -->
                    <div v-else>
                        <label for="New password" class="block text-900 text-l font-medium mb-1">New Password</label>
                        <InputText id="firstname1" type="password" placeholder="New Password"
                            :class="isEmpty.password.class" v-model="password" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.password.msg">Password should be at least 8 characters
                            </InlineMessage>
                        </div>
                        <label for="confirm new password" class="block text-900 text-l font-medium mb-1">Confirm New
                            Password</label>
                        <InputText id="lastname1" type="password" placeholder="Confirm New Password"
                            :class="isEmpty.Newpassword.class" v-model="Newpassword" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.Newpassword.msg">Make sure that the password is written
                                correctly
                            </InlineMessage>
                        </div>

                        <Button @click="Change" type="submit" label="Change" class="w-full p-3 text-l"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
