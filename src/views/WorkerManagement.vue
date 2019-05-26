<i18n src="../../locales.yaml"></i18n>
<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>{{$t('workerManagement')}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog">
                <template #activator="{on}">
                    <v-btn color="primary" v-on="on">{{$t('new')}} {{itemName}}</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{formTitle}}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <h2>{{$t('workerInfo')}}</h2>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="editedItem.name"
                                            :label="$t('workerName')"
                                            type="text"
                                            :rules="[() => !!editedItem.name || $t('mustInput')]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="##################"
                                            v-model="editedItem.idNumber"
                                            :label="$t('idNumber')"
                                            :rules="[rules.required($t('mustInput')),
                                            rules.idNumberMin($t('mustInput'))]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.phoneNumber"
                                            :label="$t('phoneNumber')"
                                            :rules="[rules.required($t('mustInput')),
                                            rules.phoneNumberMin($t('phoneNumberPrompt'))]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="editedItem.password"
                                            :label="$t('password')"
                                            :rules="[rules.required($t('mustInput')),
                                            rules.passwordMin($t('passwordPrompt'))]"
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
                            {{$t('cancel')}}
                        </v-btn>
                        <v-btn
                                color="blue"
                                flat
                                @click="save"
                                :disabled="editedItem.name.length===0||editedItem.idNumber.length<18||
                                editedItem.phoneNumber.length<11||editedItem.password.length<6"
                        >
                            {{$t('save')}}
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
    import UPDATE_WORKER from "../graphql/mutation/UpdateWorker.gql";
    import GET_USERS_BY_ROLE from '../graphql/query/GetUsersByRole.gql'
    import CREATE_WORKER from '../graphql/mutation/CreateWorker.gql'
    import DELETE_USER from '../graphql/mutation/DeleteUser.gql'

    export default {
        name: "WorkerManagement",
        data:()=>({
            dialog:false,
            users:[],
            editedId:-1,
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
                return this.editedId===-1?`${this.$t('new')} ${this.itemName}`:`${this.$t('edit')} ${this.itemName}`
            },
            itemName(){
                return this.$t('worker');
            },
            headers(){
                return [
                    {
                        text:this.$t('workerName'),
                        align:'left',
                        sortable:false,
                        value:'name'
                    },
                    {
                        text:this.$t('idNumber'),
                        value:'idNumber'
                    },
                    {
                        text:this.$t('phoneNumber'),
                        value:'phoneNumber'
                    },
                    {
                        text:this.$t('action'),
                        value:'name',
                        sortable:false
                    }
                ]
            }
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
                })
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
                    query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'WORKER',
                        isResident: false
                    }
                });
                data.users.push(createWorker);
                store.writeQuery({query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'WORKER',
                        isResident: false
                    },data})
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
                    mutation:DELETE_USER,
                    variables:{id},
                    update:(store,{data:{deleteWorker}})=>{
                        this.updateStoreAfterDeleteWorker(store,deleteWorker)
                    }
                })
            },
            updateStoreAfterDeleteWorker(store,deleteWorker){
                const data=store.readQuery({
                    query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'WORKER',
                        isResident: false
                    }
                });
                data.users.remove(user=>user.id===deleteWorker);
                store.writeQuery({query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'WORKER',
                        isResident: false
                    },data});
            }
        },
        apollo:{
            users:{
                query:GET_USERS_BY_ROLE,
                variables:{
                    role: 'WORKER',
                    isResident: false
                }
            }
        }
    }
</script>

<style scoped>

</style>