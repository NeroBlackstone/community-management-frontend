<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>活动申请</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
        </v-toolbar>
        <v-form class="mx-2">
            <v-text-field
                    v-model="message.title"
                    label="活动名称"
                    type="text"
                    :rules="[rules.required]"
                    required
            ></v-text-field>
            <v-textarea
                    v-model="message.content"
                    label="活动内容"
                    type="text"
                    :rules="[rules.required]"
                    required
            ></v-textarea>
            <v-text-field
                    v-model="message.place"
                    label="地点"
                    type="text"
                    :rules="[rules.required]"
                    required
            ></v-text-field>
            <date-field v-model="message.date" title="开始日期"></date-field>
            <time-field v-model="message.time" title="开始时间"></time-field>
            <v-btn
                    :disabled="message.title.length===0||message.place.length===0||message.content.length===0"
                    color="primary"
                    @click="createActivity">
                提交
            </v-btn>

        </v-form>
    </div>
</template>

<script>
    import {TEXT_FIELD_RULES, USER_ID} from "../settings";
    import DateField from "../components/DateField";
    import TimeField from "../components/TimeField";
    import {CREATE_ACTIVITY,MY_ACTIVITIES} from "../queries";

    export default {
        name: "ActivityApplication",
        components: {
            TimeField,
            DateField
        },
        data:()=>({
            dialog:false,
            message:{
                date:new Date().format('{yyyy}-{MM}-{dd}'),
                time:new Date().format('{HH}:{mm}'),
                title:'',
                content:'',
                place:''
            },
            rules:TEXT_FIELD_RULES
        }),
        computed:{
            isoDate(){
                return `${this.message.date}T${this.message.time}:00+08:00`
            }
        },
        methods:{
            async createActivity(){
                await this.$apollo.mutate({
                    mutation:CREATE_ACTIVITY,
                    variables:{
                        id:localStorage.getItem(USER_ID),
                        title:this.message.title,
                        content:this.message.content,
                        place:this.message.place,
                        startAt:this.isoDate
                    },
                    update:(store,{data:{createActivity}})=>{
                        this.updateStoreAfterCreateActivity(store,createActivity);
                    }
                });
                this.$router.go(-1);
            },
            updateStoreAfterCreateActivity(store,createActivity){
                const data=store.readQuery({
                    query:MY_ACTIVITIES,
                    variables:{
                        id:localStorage.getItem(USER_ID)
                    }
                });
                data.activities.push(createActivity);
                store.writeQuery({query:MY_ACTIVITIES,variables:{id:localStorage.getItem(USER_ID)},data});
            }
        }
    }
</script>

<style scoped>

</style>