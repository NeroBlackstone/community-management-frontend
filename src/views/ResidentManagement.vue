<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>社区人员管理</v-toolbar-title>
            <!--占位符 property 用来设置间距的类型：m - 对应 margin -->
            <!--占位符 direction 指定属性所应用到的方向：x - 同时对应*-left和*-right属性-->
            <!--占位符 size 控制属性的增量：2 - 将margin或者padding属性设置为$spacer * .5-->
            <!--inset-添加缩进72px-->
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog">
                <template #activator="{on}">
                    <v-btn color="primary" v-on="on">新建{{itemName}}</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{formTitle}}</span>
                    </v-card-title>
                    <v-card-text>
                        <!--v-layout is used for separating sections and contains the v-flex.-->
                        <!--The structure of your layout will be as follows, v-container » v-layout » v-flex-->
                        <v-container grid-list-md>
                            <h2>居民信息</h2>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            v-model="editedItem.name"
                                            label="居民名字"
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
                                    <v-select :items="selectSex" label="性别" v-model="editedItem.sex"></v-select>
                                </v-flex>
                            </v-layout>
                            <h2>地址</h2>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.address.building"
                                            label="楼栋号"
                                            :rules="[() => !!editedItem.address.building || '必填']"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.address.unit"
                                            label="单元号"
                                            :rules="[() => !!editedItem.address.unit || '必填']"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                    <v-text-field
                                            mask="###########"
                                            v-model="editedItem.address.room"
                                            label="房间号"
                                            :rules="[() => !!editedItem.address.room || '必填']"
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
                                editedItem.phoneNumber.length<11||editedItem.address.building.length===0||
                                editedItem.address.unit.length===0||editedItem.address.room.length===0||
                                editedItem.sex.length===0"
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

                <td v-if="props.item.sex==='FEMALE'">女</td>
                <td v-else>男</td>
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
    import {ALL_RESIDENTS, CREATE_RESIDENTS, DELETE_RESIDENT, UPDATE_RESIDENT} from '../queries'
    export default {
        name: "ResidentManagement",
        data: () => ({
            itemName:"居民",
            users:[],
            dialog:false,
            editedId:-1,
            selectSex:[
                {
                    value:'MALE',
                    text:'男'
                },
                {
                    value:'FEMALE',
                    text:"女"
                }
                ],
            headers:[
                {
                    text:'居民姓名',
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
                    text:'性别',
                    value:'sex',
                },
                {
                    text:'地址',
                    value:'address'
                },
                {
                    text:'操作',
                    value:'name',
                    sortable:false
                }
            ],
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
            /*defaultItem: {
                name:"",
                idNumber:"",
                phoneNumber:"",
                sex:'',
                address:{
                    building:0,
                    unit:0,
                    room:0,
                }
            },*/
            rules:TEXT_FIELD_RULES
        }),
        computed:{
            formTitle(){
                return this.editedId === -1 ? `新建 ${this.itemName}` : `编辑 ${this.itemName}`
            },
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
                let deleteConfirm=confirm('你确定?');
                if(deleteConfirm){
                    this.users.remove(item);
                    this.deleteResident(item.id);
                }
            },
            async deleteResident(id){
                await this.$apollo.mutate({
                    mutation:DELETE_RESIDENT,
                    variables:{id},
                    update:(store,{data:{deleteResident}})=>{
                        this.updateStoreAfterDeleteResident(store,deleteResident)
                    }
                })
            },
            updateStoreAfterDeleteResident(store,deleteResident){
                const data=store.readQuery({
                    query:ALL_RESIDENTS
                });
                data.users.remove(user=>user.id===deleteResident.id);
                store.writeQuery({query:ALL_RESIDENTS,data});
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
                    update:(store,{data:{updateResident}})=>{
                        this.updateStoreAfterUpdateResident(store,updateResident);
                    },
                })
            },
            updateStoreAfterUpdateResident(store,updatedResident){
                const data=store.readQuery({
                    query:ALL_RESIDENTS
                });
                data.users.remove(user=>user.id===updatedResident.id);
                data.users.push(updatedResident);
                store.writeQuery({query:ALL_RESIDENTS,data});
            },
            async createResident(){
                await this.$apollo.mutate({
                    mutation:CREATE_RESIDENTS,
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
                    query:ALL_RESIDENTS
                });
                data.users.push(createResident);
                store.writeQuery({query:ALL_RESIDENTS,data});
            }
        },
        apollo:{
            users:{
                query:ALL_RESIDENTS,
            },
        }
    }
</script>

<style scoped>

</style>