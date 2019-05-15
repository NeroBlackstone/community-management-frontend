<template>
    <div >
        <v-toolbar
                color="blue-grey"
                dark
                fixed
                app
                clipped-right
        >
            <v-toolbar-side-icon v-if="this.$root.$data.userId" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>社区信息管理系统</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="this.$root.$data.userId" @click="logout" icon>
                <v-icon>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>
        <v-navigation-drawer
                v-model="drawer"
                fixed
                app
        >
            <v-list dense>
                    <v-list-tile v-for="link in links" :key="link.text" router :to="link.router">
                        <v-list-tile-action>
                            <v-icon class="white--text">{{link.icon}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{link.text}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
    //import {ROLE_OF_USER} from "../queries";
    import {USER_ID, AUTH_TOKEN, USER_ROLE} from "../settings";

    export default {
        name: "Navbar",
        data: () => ({
            drawer: null,
        }),
        methods:{
            logout () {
                localStorage.removeItem(USER_ID);
                localStorage.removeItem(AUTH_TOKEN);
                sessionStorage.removeItem(USER_ROLE);
                this.$root.$data.userId = localStorage.getItem(USER_ID);
                this.$router.push('/')
            }
        },
/*        apollo:{
            user:{
                query: ROLE_OF_USER,
                variables:{
                    id:localStorage.getItem(USER_ID)
                }
            }
        },*/
        computed:{
            links(){
                if (this.$root.$data.role==="RESIDENT"){
                    return [
                        {
                            text:'活动申请',
                            icon:"",
                            router:"/activity",
                        },
                        {
                            text:'提交意见和建议',
                            icon:"",
                            router:'/advice'
                        },
                    ];
                }
                else if (this.$root.$data.role==="WORKER"){
                    return [
                        {
                            text:'意见和建议',
                            icon:'',
                            router:'/advice'
                        },
                        {
                            text:'社区人员管理',
                            icon:'',
                            router:'/residentManagement'
                        },
                        {
                            text:'活动管理',
                            icon:'',
                            router:'/activityManagement'
                        }
                    ];
                }else if (this.$root.$data.role==="MANAGER"){
                    return [
                        {
                            text:'意见和建议',
                            icon:'',
                            router:'/advice'
                        },
                        {
                            text:'社区人员管理',
                            icon:'',
                            router:'/residentManagement'
                        },

                        {
                            text:'工作人员管理',
                            icon:'',
                            router:'/workerManagement'
                        },
                        {
                            text:'活动管理',
                            icon:'',
                            router:'/activityManagement'
                        }
                    ];
                }else return [];
            }
        }
    }
</script>

<style scoped>

</style>