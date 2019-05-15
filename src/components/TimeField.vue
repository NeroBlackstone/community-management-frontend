<template>
    <v-menu
            v-model="menu"
            :nudge-right="80"
            :close-on-content-click="false"
            lazy
            min-width="290px">
        <template #activator="{ on }">
            <v-text-field
                    :value="value"
                    :label="title"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
            ></v-text-field>
        </template>
        <v-time-picker :value="value" @input="$emit('input',$event)"></v-time-picker>
    </v-menu>
</template>

<script>
    export default {
        name: "TimeField",
        props:['value','title'],
        data:()=>({
           menu:false
        }),
    }
</script>

<style scoped>

</style>