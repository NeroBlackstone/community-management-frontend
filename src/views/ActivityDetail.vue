<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        committed: 'Committed'
    zhHans:
        committed: '已提交'
</i18n>
<template>
    <ApolloQuery :query="query" :variables="{id:$route.params.id}" #default="{result:{loading,error,data}}">
        <div v-if="data">
            <v-stepper >
                <v-stepper-header v-if="data.activity.status==='PENDING'">
                    <v-stepper-step step="1" complete>
                        {{$t('committed')}}
                    </v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step step="2">
                        {{$t('pendingStatus')}}
                    </v-stepper-step>
                </v-stepper-header>
                <v-stepper-header v-else>
                    <v-stepper-step step="1" complete>
                        {{$t('committed')}}
                    </v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step v-if="data.activity.status==='APPROVED'" step="2" complete>
                        {{$t('approvedStatus')}}
                    </v-stepper-step>
                    <v-stepper-step v-else step="2" :rules="[() => false]">
                        {{$t('rejectedStatus')}}
                    </v-stepper-step>
                </v-stepper-header>
            </v-stepper>
            <v-card class="mx-auto" color="primary" dark max-width="800">
                <v-card-title>
                    <span class="title font-weight-light">{{data.activity.title}}</span>
                </v-card-title>
                <v-card-text class="headline font-weight-bold">
                    {{$t('activityContent')}}：{{data.activity.content}}
                </v-card-text>
                <v-card-text class="headline font-weight-bold">
                    {{$t('address')}}：{{data.activity.place}}
                </v-card-text>
                <v-card-text class="headline font-italic">
                    {{$t('startAt')}}: {{dateAndTimeParser(data.activity.startAt)}}
                </v-card-text>
            </v-card>
            <v-card v-if="data.activity.reply" class="mx-auto" color="green" dark max-width="800">
                <v-card-title>
                    <span class="title font-weight-light">回复：</span>
                </v-card-title>
                <v-card-text class="headline font-weight-bold">{{data.activity.reply}}</v-card-text>
            </v-card>
        </div>
    </ApolloQuery>
</template>

<script>
    import GET_ACTIVITY_BY_ID from "../graphql/query/GetActivityById.gql";
    import {dateAndTimeParser} from '../settings'
    export default {
        name: "ActivityDetail",
        data:()=>({
            query:GET_ACTIVITY_BY_ID
        }),
        methods:{
            dateAndTimeParser
        }
    }
</script>

<style scoped>

</style>