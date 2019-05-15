<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>活动</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$router.push({path:`/activityApplication`})">申请活动</v-btn>
        </v-toolbar>
        <activity-list></activity-list>
    </div>
</template>

<script>
    import ActivityList from "../components/ActivityList";
    export default {
        name: "Activity",
        components: {ActivityList}
    }
</script>

<style scoped>

</style>