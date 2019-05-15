<template>
    <ApolloQuery :query="query" :variables="{id:userId}" #default="{result:{loading,error,data}}">
        <div v-if="data">
            <v-subheader>活动列表：</v-subheader>
            <v-list two-line>
                <template v-for="activity in data.activities">
                    <v-list-tile :key="activity.id" @click="$router.push({path:`/activity/${activity.id}`})">
                        <v-list-tile-content>
                            <v-list-tile-title>{{activity.title}}</v-list-tile-title>
                            <v-list-tile-sub-title v-if="activity.status=='PENDING'">已提交，待回复</v-list-tile-sub-title>
                            <v-list-tile-sub-title v-else-if="activity.status=='APPROVED'">允许</v-list-tile-sub-title>
                            <v-list-tile-sub-title v-else-if="activity.status=='REJECTED'">已拒绝</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </div>
    </ApolloQuery>
</template>

<script>
    import {MY_ACTIVITIES} from "../queries";
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