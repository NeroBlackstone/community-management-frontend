import Vue from 'vue'
import Router from 'vue-router'
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import ResidentDialog from "./components/ResidentDialog";

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
            path:'/population',
            component:ResidentDialog
        }
        ],
})
