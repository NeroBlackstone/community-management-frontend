import Vue from 'vue'
import Router from 'vue-router'
import LoginForm from "../views/LoginForm";
import SignUpForm from "../views/SignUpForm";
import ResidentManagement from "../views/ResidentManagement";
import AdviceAndReport from "../views/AdviceAndReport";
import AdviceDetail from "../views/AdviceDetail";
import WorkerManagement from "../views/WorkerManagement";
import ActivityApplication from "../views/ActivityApplication";
import Activity from "../views/Activity";
import ActivityDetail from "../views/ActivityDetail";
import ActivityManagement from "../views/ActivityManagement";
import ImageInput from "../components/ImageInput";

Vue.use(Router);

export default new Router({
    mode:'history',
    base:process.env.BASE_URL,
    routes:[
        {
            path:'/',
            component:LoginForm
        },
        {
            path:'/signup',
            component:SignUpForm
        },
        {
            path:'/residentManagement',
            component:ResidentManagement
        },
        {
            path:'/advice',
            component:AdviceAndReport
        },
        {
            path:'/advice/:id',
            component:AdviceDetail
        },
        {
            path:'/activity/:id',
            component:ActivityDetail
        },
        {
            path:'/workerManagement',
            component:WorkerManagement
        },
        {
            path:'/activityApplication',
            component:ActivityApplication
        },
        {
            path:'/activity',
            component:Activity
        },
        {
            path:'/activityManagement',
            component:ActivityManagement
        },
        {
            path:'/imageInput',
            component:ImageInput
        }
        ],
})
