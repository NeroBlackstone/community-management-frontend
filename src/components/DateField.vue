<template>
    <v-menu v-model="menu" :nudge-right="80" :close-on-content-click="false" lazy min-width="290px">
        <template #activator="{ on }">
            <v-text-field :value="value" :label="title" prepend-icon="event" readonly v-on="on"></v-text-field>
        </template>
        <v-date-picker :value="value" :min="today" @input="input"></v-date-picker>
    </v-menu>
</template>

<script>
    import {dateParser} from "../settings";

    export default {
        name: "DateField",
        props:['value','title'],
        data:()=>({
            menu:false,
            today: dateParser(new Date())
        }),
        methods:{
            input(event){
                this.menu=false;
                this.$emit('input',event);
            }
        }
    }
</script>

<style scoped>

</style>