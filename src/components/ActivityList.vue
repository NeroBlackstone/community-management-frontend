<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        activityList: 'Activity List'
    zhHans:
        activityList: '活动列表'
</i18n>
<template>
    <ApolloQuery :query="query" :variables="{id:userId}" #default="{result:{loading,error,data}}">
        <div v-if="data">
            <v-subheader v-t="'activityList'"></v-subheader>
            <v-list two-line>
                <template v-for="(activity,index) in data.activities">
                    <v-list-tile :key="activity.id" @click="$router.push({path:`/activity/${activity.id}`})">
                        <v-list-tile-content>
                            <v-list-tile-title>{{activity.title}}</v-list-tile-title>
                            <v-list-tile-sub-title v-t="'pendingStatus'" v-if="activity.status==='PENDING'">
                            </v-list-tile-sub-title>
                            <v-list-tile-sub-title v-t="'approvedStatus'" v-else-if="activity.status==='APPROVED'">
                            </v-list-tile-sub-title>
                            <v-list-tile-sub-title v-t="'rejectedStatus'" v-else-if="activity.status==='REJECTED'">
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < data.activities.length" :key="`divider-${index}`"></v-divider>
                </template>
            </v-list>
        </div>
    </ApolloQuery>
</template>

<script>
    import MY_ACTIVITIES from "../graphql/query/MyActivities.gql";
    import {USER_ID} from "../settings";

    export default {
        name: "ActivityList",
        data:()=>({
            query:MY_ACTIVITIES,
            userId:localStorage.getItem(USER_ID)
        }),
    }
</script>

<style scoped>

</style>