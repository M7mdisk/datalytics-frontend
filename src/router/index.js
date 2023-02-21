import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    // component: () => import('@/views/Dashboard.vue')
                    component: () => import('@/views/Datasets.vue')
                },
                {
                    path: '/ml-models',
                    name: 'ML Modles',
                    component: () => import('@/views/MLPage.vue')
                },
                {
                    path: '/ml-models/new-ml-model',
                    name: 'New Model',
                    component: () => import('@/views/NewMLModel.vue')
                },
                {
                    path: '/datasets',
                    name: 'datasets',
                    component: () => import('@/views/Datasets.vue')
                },
                {
                    path: '/datasets/:id',
                    name: 'datasetdetails',
                    component: () => import('@/views/DatasetDetails.vue')
                },
                {
                    path: '/datasets/upload',
                    name: 'uploaddataset',
                    component: () => import('@/views/Upload.vue')
                },
            ]
        },
    
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('@/views/pages/auth/Profile.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('@/views/pages/auth/signup.vue')
        },
       
      
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});
function isAuth() {
    const token = window.localStorage.getItem('Token');
    if (token == 'null' || token == '' || token == null || token == undefined) return false;
    else return true;
}
router.beforeEach((to, from, next) => {
    if (isAuth()) {
        next();
        return;
    }

    if (to.name == 'login' || to.name == 'signup') next();
    else {
        next({ name: 'login' });
    }
});


export default router;
