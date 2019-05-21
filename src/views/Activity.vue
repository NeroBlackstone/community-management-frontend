<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        activity: 'Activity'
    zhHans:
        activity: '活动'
</i18n>
<template>
    <div>
        <v-toolbar>
            <v-toolbar-title v-t="'activity'"></v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn v-t="'activityApplication'" color="primary" @click="$router.push({path:`/activityApplication`})">
            </v-btn>
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