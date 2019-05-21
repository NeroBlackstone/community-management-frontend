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
                <template v-for="advice in data.getAdvicesByRole">
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
    import {GET_ADVICE_BY_ROLE} from '../queries'
    export default {
        name: "AdviceList",
        data:()=>({
            userId:localStorage.getItem(USER_ID),
            query:GET_ADVICE_BY_ROLE
        }),
    }
</script>

<style scoped>

</style>