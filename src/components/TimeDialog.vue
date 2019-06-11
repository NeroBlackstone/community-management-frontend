<!--
<i18n src="../../locales.yaml"></i18n>

<template>
    <v-dialog @input="$emit('input')" :value="show">
        <v-card>
            <v-card-text>
                <time-field v-model="time" :title="$t('startTime')"></time-field>
                <date-field v-model="date" :title="$t('startDate')"></date-field>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" flat @click="$emit('close')">
                    {{$t('cancel')}}
                </v-btn>
                <v-btn color="blue" flat @click="save">
                    {{$t('save')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import DateField from "./DateField";
    import TimeField from './TimeField';
    export default {
        name: "TimeDialog",
        components: {DateField,TimeField},
        props:['editTime','editDate','value'],
        data:()=>({
            show:this.value,
            tempDate:
        }),
        computed:{
            date:{
                get: function () {
                    return this.editDate
                },
                set: function (val) {

                }
            },
            time(){
                return this.editTime
            }
        },
        methods:{
            save(){
                this.$emit('save',{date:this.date,time:this.time});
                this.show=false
            }
        }
    }
</script>

<style scoped>

</style>-->
