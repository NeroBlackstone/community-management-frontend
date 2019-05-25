import VueApollo from 'vue-apollo'
import Vue from 'vue'
import {ApolloLink} from 'apollo-link'
import {createUploadLink} from 'apollo-upload-client'
import {AUTH_TOKEN} from "../settings";
import {ApolloClient} from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";

Vue.use(VueApollo);

const httpLink=createUploadLink({uri:'http://localhost:4000/'});

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

export default new VueApollo({
    defaultClient:apolloClient,
    defaultOptions:{
        $loadingKey:'loading'
    }
});