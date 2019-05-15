<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>工作人员管理</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog">
                <template #activator="{on}">
                    <v-btn color="primary" v-on="on">新建 {{itemName}}</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{formTitle}}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <h2>工作人员信息</h2>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="editedItem.name"
                                            label="工作人员姓名"
                                            type="text"
                                            :rules="[() => !!editedItem.name || '必填']"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="##################"
                                            v-model="editedItem.idNumber"
                                            label="身份证号"
                                            :rules="[rules.required,rules.idNumberMin]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.phoneNumber"
                                            label="电话号码"
                                            :rules="[rules.required,rules.phoneNumberMin]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="editedItem.password"
                                            label="密码"
                                            :rules="[rules.required,rules.passwordMin]"
                                    >
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="red"
                                flat
                                @click="close"
                        >
                            取消
                        </v-btn>
                        <v-btn
                                color="blue"
                                flat
                                @click="save"
                                :disabled="editedItem.name.length===0||editedItem.idNumber.length<18||
                                editedItem.phoneNumber.length<11||editedItem.password.length<6"
                        >
                            保存
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-data-table :headers="headers" :items="users" class="elevation-1">
            <template #items="props">
                <td >{{props.item.name}}</td>
                <td >{{props.item.idNumber}}</td>
                <td >{{props.item.phoneNumber}}</td>
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import {TEXT_FIELD_RULES} from "../settings";
    import {ALL_WORKERS, CREATE_WORKER, DELETE_WORKER, UPDATE_WORKER} from "../queries";

    export default {
        name: "WorkerManagement",
        data:()=>({
            dialog:false,
            users:[],
            editedId:-1,
            itemName:"工作人员",
            headers:[
                {
                text:'工作人员姓名',
                align:'left',
                sortable:false,
                value:'name'
                },
                {
                    text:'身份证号',
                    value:'idNumber'
                },
                {
                    text:'电话号码',
                    value:'phoneNumber'
                },
                {
                    text:'操作',
                    value:'name',
                    sortable:false
                }
            ],
            editedItem:{
                name:'',
                idNumber:'',
                phoneNumber:'',
                password:''
            },
            defaultItem:{
                name:'',
                idNumber:'',
                phoneNumber:'',
                password:''
            },
            rules:TEXT_FIELD_RULES
        }),
        computed:{
            formTitle(){
                return this.editedId===-1?`新建${this.itemName}`:`编辑${this.itemName}`
            },
        },
        methods:{
            close(){
                this.dialog=false;
                setTimeout(()=>{
                    this.editedItem=Object.assign({},this.defaultItem);
                    this.editedId=-1
                },300)
            },
            editItem(item){
                this.editedId=item.id;
                this.editedItem=Object.assign({},item);
                this.editedItem.password='******';
                this.dialog=true;
            },
            save(){
                if (this.editedId!==-1){
                    this.updateWorker();
                } else {
                    this.createWorker();
                }
                this.close();
            },
            async updateWorker(){
                await this.$apollo.mutate({
                    mutation:UPDATE_WORKER,
                    variables:{
                        id:this.editedId,
                        idNumber:this.editedItem.idNumber,
                        name:this.editedItem.name,
                        phoneNumber:this.editedItem.phoneNumber,
                        password:this.editedItem.phoneNumber
                    },
                    update:(store,{date:{updateWorker}})=>{
                        this.updateStoreAfterUpdateWorker(store,updateWorker);
                    }
                })
            },
            updateStoreAfterUpdateWorker(store,updateWorker){
                const data=store.readQuery({
                   query:ALL_WORKERS
                });
                data.users.remove(user=>user.id===updateWorker.id);
                data.users.push(updateWorker);
                store.writeQuery({query:ALL_WORKERS,data});
            },
            async createWorker(){
                await this.$apollo.mutate({
                    mutation:CREATE_WORKER,
                    variables:{
                        idNumber:this.editedItem.idNumber,
                        name:this.editedItem.name,
                        phoneNumber:this.editedItem.phoneNumber,
                        password:this.editedItem.password,
                    },
                    update:(store,{data:{createWorker}})=>{
                        this.updateStoreAfterCreateWorker(store,createWorker);
                    }
                })
            },
            updateStoreAfterCreateWorker(store,createWorker){
                const data=store.readQuery({
                    query:ALL_WORKERS
                });
                data.users.push(createWorker);
                store.writeQuery({query:ALL_WORKERS,data})
            },
            deleteItem(item){
                let deleteConfirm=confirm('Are you sure');
                if (deleteConfirm){
                    this.users.remove(item);
                    this.deleteWorker(item.id);
                }
            },
            async deleteWorker(id){
                await this.$apollo.mutate({
                    mutation:DELETE_WORKER,
                    variables:{id},
                    update:(store,{data:{deleteWorker}})=>{
                        this.updateStoreAfterDeleteWorker(store,deleteWorker)
                    }
                })
            },
            updateStoreAfterDeleteWorker(store,deleteWorker){
                const data=store.readQuery({
                    query:ALL_WORKERS,
                });
                data.users.remove(user=>user.id===deleteWorker);
                store.writeQuery({query:ALL_WORKERS,data});
            }
        },
        apollo:{
            users:{
                query:ALL_WORKERS
            }
        }
    }
</script>

<style scoped>

</style>