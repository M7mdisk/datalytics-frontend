<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const { layoutConfig, contextPath } = useLayout();
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const invalidmsg = ref('');
const invalidClass = ref('');
const emptyField = ref('');
const emptyFieldMsg = ref('');

const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
function setUser(data) {
    window.localStorage.setItem("Username", data.first_name + " " + data.last_name)
    window.localStorage.setItem("Token", data.token)
}
async function signup() {
    const data = {
        email: email.value,
        password: password.value,
        first_name: firstname.value,
        last_name: lastname.value,

    }
    if (firstname.value == '' || lastname.value == '') {
        emptyField.value = 'p-invalid';
        emptyFieldMsg.value = 'This field is requierd';
    }
    else {
        const res = axios.post('http://127.0.0.1:8000/api/register/', data).catch(() => {
            invalidmsg.value = 'Wrong email format'
            invalidClass.value = 'p-invalid'
        });
        if ((await res).status == 201) {
            router.push('/')
            setUser((await res).data)
        }
    }

}
</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <span class="block  text-3xl font-medium mb-2">Sign up</span>
                    </div>

                    <div>
                        <label for="firstname1" class="block text-900 text-xl font-medium mb-2">First Name</label>
                        <InputText id="firstname1" type="text" placeholder="First Name" :class="'w-full md:w-30rem '+emptyField"
                            style="padding: 1rem" v-model="firstname" />
                        <div class="fieldBox mb-5">
                            <small id="username2-help" class="p-error">{{ emptyFieldMsg }}</small>
                        </div>
                        <label for="lastname1" class="block text-900 text-xl font-medium mb-2">Last Name</label>
                        <InputText id="lastname1" type="text" placeholder="Last Name" :class="'w-full md:w-30rem '+emptyField"
                            style="padding: 1rem" v-model="lastname" />
                        <div class="fieldBox mb-5">
                            <small id="username2-help" class="p-error">{{ emptyFieldMsg }}</small>
                        </div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>

                        <InputText id="email1" type="text" placeholder="Email address"
                            :class="'w-full md:w-30rem ' + invalidClass" style="padding: 1rem" v-model="email" />
                        <div class="fieldBox mb-5">
                            <small id="username2-help" class="p-error">{{ invalidmsg }}</small>
                        </div>
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"><template #header>
                                <h6>Pick a password</h6>
                            </template>
                            <template #footer="sp">
                                {{ sp.level }}
                                <Divider />
                                <p class="mt-2">Suggestions</p>
                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                    <li>At least one lowercase</li>
                                    <li>At least one uppercase</li>
                                    <li>At least one numeric</li>
                                    <li>Minimum 8 characters</li>
                                </ul>
                            </template>
                        </Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">

                        </div>
                        <Button @click="signup" label="Sign Up" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
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
