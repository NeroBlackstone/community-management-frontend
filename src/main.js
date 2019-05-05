import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import {HttpLink} from 'apollo-link-http'
import {ApolloLink} from 'apollo-link'
import {AUTH_TOKEN, USER_ID} from "./settings"
import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import Sugar from 'sugar'

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

Vue.use(VueApollo);

const apolloProvider=new VueApollo({
  defaultClient:apolloClient,
  defaultOptions:{
    $loadingKey:'loading'
  }
});

let userId=localStorage.getItem(USER_ID);

new Vue({
  apolloProvider:apolloProvider,
  router,
  data:{
    userId
  },
  render: h => h(App),
}).$mount('#app');
