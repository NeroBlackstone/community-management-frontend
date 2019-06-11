<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        prev: 'Prev'
        next: 'Next'
    zhHans:
        prev: '向前'
        next: '向后'
</i18n>

<template>
    <div>
        <!--v-layout: wrap  Allows children to wrap within the container if the elements use more than 100%.  -->
        <v-layout wrap>
            <v-flex xs12 class="mb-3">
                <v-sheet height="500">
                    <v-calendar :end="end" v-model="start" ref="calendar" :now="today" :value="today" color="primary">
                        <template #day="{ date }">
                            <template v-for="activity in activitiesMap[date]">
                                <v-menu :key="activity.title" full-width offset-x>
                                    <template #activator="{ on }">
                                        <!--波纹指令 v-ripple指令被用于显示用户的操作。-->
                                        <div
                                                v-if="!activity.time"
                                                v-ripple
                                                class="my-event"
                                                v-on="on"
                                                v-html="activity.title"
                                        >
                                        </div>
                                    </template>
                                    <v-card color="lighten-4" min-width="350px" flat>
                                        <v-toolbar color="primary" dark>
                                            <v-btn icon @click="deleteItem(activity)">
                                                <v-icon>delete</v-icon>
                                            </v-btn>
                                            <v-toolbar-title v-html="activity.title"></v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-btn icon @click="editItemTime(activity)">
                                                <v-icon>access_alarm</v-icon>
                                            </v-btn>
                                            <v-btn icon v-if="activity.status==='PENDING'" @click="editItemStatus(activity)">
                                                <v-icon>edit</v-icon>
                                            </v-btn>
                                        </v-toolbar>
                                        <v-card-text primary-title>
                                            <span>
                                                {{$t('applicant')}}:{{activity.owner.name}}
                                            </span><br>
                                            <span>
                                                {{$t('activityContent')}}:{{activity.content}}
                                            </span><br>
                                            <span>
                                                {{$t('activityStatus')}}:
                                            </span>
                                            <span v-if="activity.status==='PENDING'">
                                                {{$t('pendingStatus')}}
                                            </span>
                                            <span v-else-if="activity.status==='APPROVED'">
                                                {{$t('approvedStatus')}}
                                            </span>
                                            <span v-else-if="activity.status==='REJECTED'">
                                                {{$t('rejectedStatus')}}
                                            </span>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-btn flat color="secondary">
                                                {{$t('cancel')}}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </template>
                        </template>
                    </v-calendar>
                </v-sheet>
            </v-flex>
            <v-flex sm6 xs12 class="text-sm-left text-xs-center">
                <v-btn @click="$refs.calendar.prev()">
                    <v-icon dark left>
                        keyboard_arrow_left
                    </v-icon>
                    {{$t('prev')}}
                </v-btn>
            </v-flex>
            <v-flex sm6 xs12 class="text-sm-right text-xs-center">
                <v-btn @click="$refs.calendar.next()">
                    {{$t('next')}}
                    <v-icon right dark>
                        keyboard_arrow_right
                    </v-icon>
                </v-btn>
            </v-flex>
        </v-layout>

        <!--在ActivityManagement组建中维护了一份一模一样的代码，考虑优化。暂时没有抽离成组件的思路-->
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
                    <v-textarea :rules="[rules.required($t('mustInput'))]" :label="$t('reply')" v-model="editReply">
                    </v-textarea>
                    <v-select
                            :rules="[rules.required($t('mustInput'))]"
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
    import ALL_ACTIVITIES from '../graphql/query/AllActivities.gql';
    import UPDATE_ACTIVITY_STATUS from '../graphql/mutation/UpdateActivityStatus.gql'
    import DELETE_ACTIVITY from '../graphql/mutation/DeleteActivity.gql';
    import UPDATE_ACTIVITY_TIME from '../graphql/mutation/UpdateActivityTime.gql'
    import TimeField from "../components/TimeField";
    import DateField from "../components/DateField";
    import {dateParser, timeParser,TEXT_FIELD_RULES} from "../settings";
    export default {
        name: "ActivityCalendar",
        components: {DateField, TimeField},
        data: () => ({
            today: dateParser(new Date()),
            start: '2019-05-01',
            end: '2019-06-01',
            type: 'month',
            timeDialog:false,
            replyDialog:false,
            editDialog:false,
            activities: [],
            editDate:'',
            editTime:'',
            editId:'',
            editReply:'',
            editStatus:'',
            rules:TEXT_FIELD_RULES,
        }),
        computed: {
            // convert the list of activities into a map of lists keyed by date
            activitiesMap () {
                const map = {};
                this.activities.forEach(e =>{
                    const key = dateParser(e.startAt);
                    (map[key] = map[key] || []).push(e)
                });
                return map
            },
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
        },
        methods: {
            deleteItem(item){
                let deleteConfirm=confirm(this.$t('areYouSure'));
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
            closeTimeDialog(){
                this.timeDialog=false;
            },
            closeReplyDialog(){
                this.replyDialog=false;
            }
            ,
            editItemTime(activity){
                this.timeDialog=true;
                this.editDate=dateParser(activity.startAt);
                this.editTime=timeParser(activity.startAt);
                this.editId=activity.id;
            },
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
        apollo:{
            activities:{
                query:ALL_ACTIVITIES,
            }
        }
    }
</script>
<!--lang="stylus" 使用stylus预处理器-->
<style lang="stylus" scoped>
    .my-event {
        //overflow 属性规定当内容溢出元素框时发生的事情。
        //hidden 将盒子中的溢出隐藏
        overflow: hidden;
        //text-overflow 属性规定当文本溢出包含元素时发生的事情。
        //ellipsis 显示省略符号来代表被修剪的文本。
        text-overflow: ellipsis;
        //white-space 属性设置如何处理元素内的空白。
        //nowrap 文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
        white-space: nowrap;
        border-radius: 2px;
        //背景颜色
        background-color: #1867c0;
        //字体颜色
        color: #ffffff;
        border: 1px solid #1867c0;
        width: 100%;
        font-size: 12px;
        padding: 3px;
        //cursor 属性规定要显示的光标的类型（形状）。
        //pointer 光标呈现为指示链接的指针（一只手）
        cursor: pointer;
        margin-bottom: 1px;
    }
</style>