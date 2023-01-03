<script setup>
import { axiosAPI } from '@/axiosAPI';
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
const { layoutConfig, contextPath } = useLayout();
let email = ref('');
let password = ref('');
const username = window.localStorage.getItem('Username');
const router = useRouter();
const invalidmsg = ref('');
const invalidClass = ref('');

const isWrong = ref({
    email: {
        class: 'w-full mb-3 ',
        msg: false
    }
});
const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

async function login() {
    const data = {
        email: email.value,
        password: password.value
    };
    const res = axiosAPI.post('/login/', data).catch((error) => {
        invalidmsg.value = 'Wrong email or password';
        invalidClass.value = 'p-invalid';
        isWrong.value.email.class = 'w-full md: w-30rem mb-5 p-invalid';
        isWrong.value.email.msg = true;
    });

    if ((await res).status == 200) {
        window.localStorage.setItem('Token', (await res).data.token);
        router.push('/datasets');
    }
}
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-5 p-2">Sign in to continue</div>
                        <!-- <div class="text-600 text-l font-medium mb-5">Sign in to continue</div> -->
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" :class="'w-full md: w-30rem mb-5 ' + invalidClass" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2 pb">Password</label>
                        <Password id="password1" :feedback="false" v-model="password" placeholder="Password" :class="isWrong.email.class" inputClass="w-full" inputStyle="padding:1rem" :toggleMask="true"> </Password>
                        <div>
                            <InlineMessage class="w-full md: w-30rem mb-5" v-if="isWrong.email.msg">Wrong Email Or Password </InlineMessage>
                        </div>
                        <p>
                            Don't have an account?
                            <router-link class="text-primary" :to="{ name: 'signup' }"> sign up</router-link>
                        </p>
                        <Button @click="login" label="Log In" class="w-full p-3 text-xl"></Button>
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
