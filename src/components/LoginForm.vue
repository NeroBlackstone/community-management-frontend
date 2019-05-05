<template>
    <ApolloMutation
            :mutation="mutation"
            :variables="{idNumber,password}"
            @done="onDone"
            #default="{mutate,loading,error}"
    >
            <center-form title="Login">
                <template #textField>
                    <v-text-field
                            prepend-icon="person"
                            name="idNumber"
                            label="IdNumber"
                            type="text"
                            mask="##################"
                            v-model="idNumber"
                            :rules="[rules.required,rules.idNumberMin]"
                    >
                    </v-text-field>
                    <password-text-field min-char="6" v-model="password"></password-text-field>
                </template>
                <template #actionField>
                    <v-spacer></v-spacer>
                    <v-btn to="/signup" color="primary">SignUp</v-btn>
                    <v-btn
                            :disabled="loading||idNumber.length<18||password.length<6"
                            @click="mutate()"
                            color="primary"
                    >
                        Login
                    </v-btn>
                </template>
            </center-form>
    </ApolloMutation>
</template>

<script>
    import CenterForm from "./CenterForm"
    import PasswordTextField from "./PasswordTextField"
    import {LOGIN} from '../queries'
    import {USER_ID,AUTH_TOKEN,TEXT_FIELD_RULES} from "../settings";

    export default {
        name: "LoginForm",
        components:{
            CenterForm,
            PasswordTextField,
        },
        data(){
            return {
                mutation:LOGIN,
                idNumber:'',
                password:'',
                rules:TEXT_FIELD_RULES
            }
        },
        methods:{
            onDone(resultObject){
                const id=resultObject.data.login.user.id;
                const token=resultObject.data.login.token;
                this.saveUserData(id,token)
            },
            saveUserData(id,token){
                localStorage.setItem(USER_ID,id);
                localStorage.setItem(AUTH_TOKEN,token);
                this.$root.$data.userId=localStorage.getItem(USER_ID);
            },

        }
    }
</script>

<style scoped>

</style>