import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './plugins/router'
import i18n from './plugins/i18n'
import apolloProvider from './plugins/apollo'
import {USER_ID,USER_ROLE} from "./settings"
import Sugar from 'sugar'
import {ROLE_OF_USER} from "./queries";

Sugar.extend();

Vue.config.productionTip = false;

let userId=localStorage.getItem(USER_ID);

new Vue({
  apolloProvider:apolloProvider,
  router,
  i18n,
  data:{
    userId,
    role:'',
  },
  created(){
    this.$apollo.query({query:ROLE_OF_USER,variables:{id:userId}})
        .then(result=>{
          sessionStorage.setItem(USER_ROLE,result.data.user.role);
          this.role=result.data.user.role;
        });
  },
  render: h => h(App),
}).$mount('#app');
