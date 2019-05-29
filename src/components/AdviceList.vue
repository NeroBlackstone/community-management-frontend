<i18n>
    en:
        adviceList: 'Advice List'
    zhHans:
        adviceList: '意见列表'
</i18n>
<template>
    <ApolloQuery :query="query" :variables="{id:userId}" #default="{result:{loading,error,data}}">
        <div v-if="data">
            <v-subheader v-t="'adviceList'"></v-subheader>
            <v-list two-line >
                <template v-for="advice in data.advices">
                    <v-list-tile :key="advice.id" @click="$router.push({path:`/advice/${advice.id}`})">
                        <v-list-tile-content>
                            <v-list-tile-title >{{advice.title}}</v-list-tile-title>
                            <v-list-tile-sub-title >{{advice.content.first(20)}}...</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </div>
    </ApolloQuery>
</template>

<script>
    import {USER_ID} from "../settings";
    import ALL_ADVICES from '../graphql/query/AllAdvices.gql'
    import GET_ADVICES_BY_OWNER from '../graphql/query/GetAdvicesByOwner.gql'
    export default {
        name: "AdviceList",
        data:()=>({
            userId:localStorage.getItem(USER_ID),
        }),
        computed:{
            query(){
                return this.$root.$data.role==='RESIDENT' ? GET_ADVICES_BY_OWNER : ALL_ADVICES
            }
        }
    }
</script>

<style scoped>

</style>