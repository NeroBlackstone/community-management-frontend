<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>活动管理</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
        </v-toolbar>
        <v-data-table :headers="headers" :items="activities" class="elevation-1">
            <template #items="props">
                <td >{{props.item.title}}</td>
                <td >{{props.item.owner.name}}</td>

                <td v-if="props.item.status==='PENDING'">待审批</td>
                <td v-else-if="props.item.status==='APPROVED'">已允许</td>
                <td v-else-if="props.item.status==='REJECTED'">已拒绝</td>
                <td>{{Date.create(props.item.startAt).format('{yyyy}-{MM}-{dd} {HH}:{mm}')}}</td>
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-1" @click="editItemTime(props.item)">access_alarm</v-icon>
                    <v-icon v-if="props.item.status==='PENDING'" small class="mr-1" @click="editItemStatus(props.item)">edit</v-icon>
                    <v-icon small class="mr-1" @click="deleteItem(props.item)">delete</v-icon>
                    <v-icon small @click="$router.push({path:`/activity/${props.item.id}`})">details</v-icon>
                </td>
            </template>
        </v-data-table>
        <v-dialog v-model="timeDialog">
            <v-card>
                <v-card-text>
                    <time-field v-model="editTime" title="时间"></time-field>
                    <date-field v-model="editDate" title="日期"></date-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="closeTimeDialog">
                        取消
                    </v-btn>
                    <v-btn color="blue" flat @click="saveTime">
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="replyDialog">
            <v-card>
                <v-card-text>
                    <v-textarea :rules="[rules.required]" label="回复" v-model="editReply"></v-textarea>
                    <v-select :rules="[rules.required]" label="选择状态" :items="selectStatus" v-model="editStatus">
                    </v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="closeReplyDialog">
                        取消
                    </v-btn>
                    <v-btn :disabled="editReply.length===0||editStatus.length===0" color="blue" flat @click="saveReply">
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {ALL_ACTIVITIES, DELETE_ACTIVITY, UPDATE_ACTIVITY_STATUS, UPDATE_ACTIVITY_TIME} from "../queries";
    import TimeField from "../components/TimeField";
    import DateField from "../components/DateField";
    import {TEXT_FIELD_RULES} from "../settings";

    export default {
        name: "ActivityManagement",
        components: {DateField, TimeField},
        data:()=>({
            activities:[],
            timeDialog:false,
            replyDialog:false,
            editDialog:false,
            editDate:'',
            editTime:'',
            editId:'',
            editReply:'',
            editStatus:'',
            selectStatus:[
                {
                    value:'APPROVED',
                    text:'允许'
                },
                {
                    value:"REJECTED",
                    text:'拒绝'
                }
            ],
            rules:TEXT_FIELD_RULES,
            headers:[
                {
                    text:'活动名称',
                    align:'left',
                    sortable:false,
                    value:'name'
                },
                {
                    text:'申请人',
                    value:'owner'
                },
                {
                    text:'活动状态',
                    value:'status'
                },
                {
                    text:'日期',
                    value:'date'
                },
                {
                    text:'操作',
                    value:'name',
                    sortable:false
                }
            ]
        }),
        methods:{
            deleteItem(item){
                let deleteConfirm=confirm('你确定吗');
                if (deleteConfirm){
                    this.activities.remove(item);
                    this.deleteActivity(item.id)
                }
            },
            async deleteActivity(id) {
                await this.$apollo.mutate({
                    mutation:DELETE_ACTIVITY,
                    variables:{id},
                    update:(store,{data:{deleteActivity}})=>{
                        this.updateStoreAfterDeleteActivity(store,deleteActivity);
                    }
                })
            },
            updateStoreAfterDeleteActivity(store,deleteActivity) {
                const data=store.readQuery({
                    query:ALL_ACTIVITIES,
                });
                data.activities.remove(activity=>activity.id===deleteActivity.id);
                store.writeQuery({query:ALL_ACTIVITIES,data});
            },
            editItemTime(activity){
                this.timeDialog=true;
                this.editDate=Date.create(activity.startAt).format('{yyyy}-{MM}-{dd}');
                this.editTime=Date.create(activity.startAt).format('{HH}:{mm}');
                this.editId=activity.id;
            },
            closeTimeDialog(){
                this.timeDialog=false;
            },
            closeReplyDialog(){
                this.replyDialog=false;
            }
            ,
            async saveTime(){
                await this.$apollo.mutate({
                    mutation:UPDATE_ACTIVITY_TIME,
                    variables:{
                        id:this.editId,
                        startAt:`${this.editDate}T${this.editTime}:00+08:00`,
                    },
                    update:(store,{data:{updateActivity}})=>{
                        this.updateStoreAfterUpdate(store,updateActivity);
                    }
                });
                this.closeTimeDialog();
            },
            updateStoreAfterUpdate(store, updateActivity) {
                const data=store.readQuery({
                    query:ALL_ACTIVITIES
                });
                data.activities.remove(activity=>activity.id===updateActivity.id);
                data.activities.push(updateActivity);
                store.writeQuery({query:ALL_ACTIVITIES,data});
            },
            editItemStatus(activity){
                this.replyDialog=true;
                this.editId=activity.id;
            },
            async saveReply(){
                await this.$apollo.mutate({
                    mutation:UPDATE_ACTIVITY_STATUS,
                    variables:{
                        id:this.editId,
                        reply:this.editReply,
                        status:this.editStatus
                    },
                    update:(store,{data:{updateActivity}})=>{
                        this.updateStoreAfterUpdate(store,updateActivity);
                    }
                });
                this.closeReplyDialog();
            },
        },
        apollo:{
            activities:{
                query:ALL_ACTIVITIES
            },
        }
    }
</script>

<style scoped>

</style>