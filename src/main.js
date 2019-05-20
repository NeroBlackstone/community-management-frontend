import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import {HttpLink} from 'apollo-link-http'
import {ApolloLink} from 'apollo-link'
import {AUTH_TOKEN, USER_ID,USER_ROLE} from "./settings"
import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import VueI18n from 'vue-i18n'
import Sugar from 'sugar'
import {ROLE_OF_USER} from "./queries";

Vue.use(VueApollo);
Vue.use(VueI18n);

Sugar.extend();

Vue.config.productionTip = false;

const httpLink=new HttpLink({uri:'http://localhost:4000/'});

const authMiddleware=new ApolloLink((operation, forward) =>{
  const token = localStorage.getItem(AUTH_TOKEN);
  operation.setContext({
    headers:{
      authorization:token?`Bearer ${token}`:null
    }
  });
  return forward(operation)
} );

const apolloClient=new ApolloClient({
  link:authMiddleware.concat(httpLink),
  cache:new InMemoryCache(),
  connectToDevTools:true
});

const apolloProvider=new VueApollo({
  defaultClient:apolloClient,
  defaultOptions:{
    $loadingKey:'loading'
  }
});

const i18n=new VueI18n({
  locale:'zh-cn',
});

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
    apolloClient.query({query:ROLE_OF_USER,variables:{id:userId}})
        .then(result=>{
          sessionStorage.setItem(USER_ROLE,result.data.user.role);
          this.role=result.data.user.role;
        });
  },
  render: h => h(App),
}).$mount('#app');
