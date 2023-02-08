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

const isEmpty = ref({
    firstname: {
        class: 'w-full md:w-30rem ',
        msg: false
    },

    lastname: {
        class: 'w-full md:w-30rem ',
        msg: false
    },
    email: {
        class: 'w-full md:w-30rem ',
        msg: false,
        MSG: ''
    },
    password: {
        class: 'w-full md:w-30rem ',
        msg: false
    }
});

function setUser(data) {
    window.localStorage.setItem('Username', data.first_name + ' ' + data.last_name);
    window.localStorage.setItem('Token', data.token);
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
async function signup() {
    const data = {
        email: email.value,
        password: password.value,
        first_name: firstname.value,
        last_name: lastname.value
    };

    if (checkData()) {
        const res = axiosAPI.post('/user/', data);
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
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-6 px-3 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-3">
                        <h2>Sign up</h2>
                    </div>

                    <div>
                        <label for="firstname1" class="block text-900 text-l font-medium mb-1">First Name</label>
                        <InputText id="firstname1" type="text" placeholder="First Name" :class="isEmpty.firstname.class" v-model="firstname" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.firstname.msg">This field is required</InlineMessage>
                        </div>
                        <label for="lastname1" class="block text-900 text-l font-medium mb-1">Last Name</label>
                        <InputText id="lastname1" type="text" placeholder="Last Name" :class="isEmpty.lastname.class" v-model="lastname" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.lastname.msg">This field is required</InlineMessage>
                        </div>
                        <label for="email1" class="block text-900 text-l font-medium mb-1">Email</label>

                        <InputText id="email1" type="text" placeholder="Email address" :class="isEmpty.email.class" v-model="email" />
                        <div class="fieldBox mb-5 mt-1">
                            <InlineMessage v-if="isEmpty.email.msg">{{ isEmpty.email.MSG }}</InlineMessage>
                        </div>
                        <label for="password1" class="block text-900 font-medium text-l mb-1">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" :class="isEmpty.password.class" inputClass="w-full"
                            ><template #header>
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
                        <div v-if="isEmpty.password.msg" class="fieldBox mt-1">
                            <InlineMessage>Weak Password</InlineMessage>
                        </div>
                        <div class="flex align-items-center justify-content-between mb-5 gap-5"></div>
                        <p>
                            Already have an account?
                            <router-link class="text-primary" :to="{ name: 'login' }">log in</router-link>
                        </p>
                        <Button @click="signup" type="submit" label="Sign Up" class="w-full p-3 text-l"></Button>
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
