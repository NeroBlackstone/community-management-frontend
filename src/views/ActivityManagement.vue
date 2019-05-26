<i18n src="../../locales.yaml"></i18n>

<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>{{$t('activityManagement')}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
        </v-toolbar>
        <v-data-table :headers="header" :items="activities" class="elevation-1">
            <template #items="props">
                <td >{{props.item.title}}</td>
                <td >{{props.item.owner.name}}</td>
                <td v-if="props.item.status==='PENDING'">{{$t('pendingStatus')}}</td>
                <td v-else-if="props.item.status==='APPROVED'">{{$t('approvedStatus')}}</td>
                <td v-else-if="props.item.status==='REJECTED'">{{$t('rejectedStatus')}}</td>
                <td>{{Date.create(props.item.startAt).format('{yyyy}-{MM}-{dd} {HH}:{mm}')}}</td>
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-1" @click="editItemTime(props.item)">
                        access_alarm
                    </v-icon>
                    <v-icon v-if="props.item.status==='PENDING'" small class="mr-1" @click="editItemStatus(props.item)">
                        edit
                    </v-icon>
                    <v-icon small class="mr-1" @click="deleteItem(props.item)">
                        delete
                    </v-icon>
                    <v-icon small @click="$router.push({path:`/activity/${props.item.id}`})">
                        details
                    </v-icon>
                </td>
            </template>
        </v-data-table>
        <v-dialog v-model="timeDialog">
            <v-card>
                <v-card-text>
                    <time-field v-model="editTime" :title="$t('startTime')"></time-field>
                    <date-field v-model="editDate" :title="$t('startDate')"></date-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="closeTimeDialog">
                        {{$t('cancel')}}
                    </v-btn>
                    <v-btn color="blue" flat @click="saveTime">
                        {{$t('save')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="replyDialog">
            <v-card>
                <v-card-text>
                    <v-textarea :rules="[rules.required('mustInput')]" :label="$t('reply')" v-model="editReply">
                    </v-textarea>
                    <v-select
                            :rules="[rules.required('mustInput')]"
                            :label="$t('chooseStatus')"
                            :items="selectStatus"
                            v-model="editStatus">
                    </v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click="closeReplyDialog">
                        {{$t('cancel')}}
                    </v-btn>
                    <v-btn :disabled="editReply.length===0||editStatus.length===0" color="blue" flat @click="saveReply">
                        {{$t('save')}}
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
            rules:TEXT_FIELD_RULES,
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
                });
                this.closeTimeDialog();
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
                });
                this.closeReplyDialog();
            },
        },
        computed:{
            selectStatus(){
                return [
                    {
                        value:'APPROVED',
                        text:this.$t('approve')
                    },
                    {
                        value:"REJECTED",
                        text:this.$t('reject')
                    }
                ]
            },
            header(){
                return [
                    {
                        text:this.$t('activityName'),
                        align:'left',
                        sortable:false,
                        value:'name'
                    },
                    {
                        text:this.$t('applicant'),
                        value:'owner'
                    },
                    {
                        text:this.$t('activityStatus'),
                        value:'status'
                    },
                    {
                        text:this.$t('date'),
                        value:'date'
                    },
                    {
                        text:this.$t('action'),
                        value:'name',
                        sortable:false
                    }
                ]
            }
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