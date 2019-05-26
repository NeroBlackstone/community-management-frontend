<i18n src="../../locales.yaml"></i18n>
<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>{{$t('populationManagement')}}</v-toolbar-title>
            <!--占位符 property 用来设置间距的类型：m - 对应 margin -->
            <!--占位符 direction 指定属性所应用到的方向：x - 同时对应*-left和*-right属性-->
            <!--占位符 size 控制属性的增量：2 - 将margin或者padding属性设置为$spacer * .5-->
            <!--inset-添加缩进72px-->
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
                        <!--v-layout is used for separating sections and contains the v-flex.-->
                        <!--The structure of your layout will be as follows, v-container » v-layout » v-flex-->
                        <v-container grid-list-md>
                            <h2>{{$t('residentInfo')}}</h2>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="editedItem.name"
                                            :label="$t('residentName')"
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
                                            rules.idNumberMin($t('idNumberPrompt'))]"
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
                                    <v-select :items="selectSex" :label="$t('sex')" v-model="editedItem.sex"></v-select>
                                </v-flex>
                            </v-layout>
                            <h2>{{$t('address')}}</h2>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.address.building"
                                            :label="$t('building')"
                                            :rules="[() => !!editedItem.address.building || $t('mustInput')]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.address.unit"
                                            :label="$t('unit')"
                                            :rules="[() => !!editedItem.address.unit || $t('mustInput')]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.address.room"
                                            :label="$t('room')"
                                            :rules="[() => !!editedItem.address.room || $t('mustInput')]"
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
                                editedItem.phoneNumber.length<11||editedItem.address.building.length===0||
                                editedItem.address.unit.length===0||editedItem.address.room.length===0||
                                editedItem.sex.length===0"
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

                <td v-if="props.item.sex==='FEMALE'">{{$t('female')}}</td>
                <td v-else>{{$t('male')}}</td>
                <td v-if="props.item.address">
                    {{props.item.address.building}}-{{props.item.address.unit}}-{{props.item.address.room}}
                </td>
                <td v-else>
                    未填写
                </td>
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
    import UPDATE_RESIDENT from '../graphql/mutation/UpdateResident.gql'
    import GET_USERS_BY_ROLE from '../graphql/query/GetUsersByRole.gql'
    import DELETE_USER from '../graphql/mutation/DeleteUser.gql'
    import CREATE_RESIDENT from '../graphql/mutation/CreateResident.gql'
    export default {
        name: "ResidentManagement",
        data: () => ({
            users:[],
            dialog:false,
            editedId:-1,
            editedItem:{
                name:"",
                idNumber:"",
                phoneNumber:"",
                sex:'',
                address:{
                    building:0,
                    unit:0,
                    room:0,
                }
            },
            rules:TEXT_FIELD_RULES
        }),
        computed:{
            formTitle(){
                return this.editedId ===
                -1 ? `${this.$t('new')} ${this.itemName}` : `${this.$t('edit')} ${this.itemName}`
            },
            itemName(){
                return this.$t('resident');
            },
            selectSex(){
                return [
                    {
                        value:'MALE',
                        text: this.$t('male')
                    },
                    {
                        value:'FEMALE',
                        text:this.$t('female')
                    }
                ]
            },
            headers(){
                return [
                    {
                        text:this.$t('residentName'),
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
                        text:this.$t('sex'),
                        value:'sex',
                    },
                    {
                        text:this.$t('address'),
                        value:'address'
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
                    this.editedItem=Object.clone({
                        name:"",
                        idNumber:"",
                        phoneNumber:"",
                        sex:'',
                        address:{
                            building:0,
                            unit:0,
                            room:0,
                        }
                    },true);
                    this.editedId=-1
                },300)
            },
            editItem(item){
                this.editedId=item.id;
                this.editedItem=Object.assign({},item);
                this.dialog=true;
            },
            save(){
                if (this.editedId!==-1){
                    this.updateResident();
                }else{
                    this.createResident();
                }
                this.close()
            },
            deleteItem(item){
                let deleteConfirm=confirm(this.$t('areYouSure'));
                if(deleteConfirm){
                    this.users.remove(item);
                    this.deleteResident(item.id);
                }
            },
            async deleteResident(id){
                await this.$apollo.mutate({
                    mutation:DELETE_USER,
                    variables:{id},
                    update:(store,{data:{deleteUser}})=>{
                        this.updateStoreAfterDeleteResident(store,deleteUser)
                    }
                })
            },
            updateStoreAfterDeleteResident(store,deleteResident){
                const data=store.readQuery({
                    query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'RESIDENT',
                        isResident: true
                    }
                });
                data.users.remove(user=>user.id===deleteResident.id);
                store.writeQuery({query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'RESIDENT',
                        isResident: true
                    },data});
            },
            async updateResident(){
                await this.$apollo.mutate({
                    mutation:UPDATE_RESIDENT,
                    variables:{
                        id:this.editedId,
                        idNumber:this.editedItem.idNumber,
                        name:this.editedItem.name,
                        phoneNumber:this.editedItem.phoneNumber,
                        sex:this.editedItem.sex,
                        building:parseInt(this.editedItem.address.building),
                        unit:parseInt(this.editedItem.address.unit),
                        room:parseInt(this.editedItem.address.room)
                    },
                })
            },
            async createResident(){
                await this.$apollo.mutate({
                    mutation:CREATE_RESIDENT,
                    variables:{
                        idNumber:this.editedItem.idNumber,
                        name:this.editedItem.name,
                        phoneNumber:this.editedItem.phoneNumber,
                        sex:this.editedItem.sex,
                        building:parseInt(this.editedItem.address.building),
                        unit:parseInt(this.editedItem.address.unit),
                        room:parseInt(this.editedItem.address.room)
                    },
                    //注意这个data后面的解构的变量名一定要写和mutation name一样
                    update:(store,{data:{createResident}})=>{
                        this.updateStoreAfterCreateResident(store,createResident);
                    },
                })
            },
            updateStoreAfterCreateResident(store, createResident){
                const data=store.readQuery({
                    query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'RESIDENT',
                        isResident: true
                    }
                });
                data.users.push(createResident);
                store.writeQuery({query:GET_USERS_BY_ROLE,
                    variables:{
                        role: 'RESIDENT',
                        isResident: true
                    },data});
            }
        },
        apollo:{
            users:{
                query:GET_USERS_BY_ROLE,
                variables:{
                    role: 'RESIDENT',
                    isResident: true
                }
            },
        }
    }
</script>

<style scoped>

</style>