<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        loginError: 'You are not registered or the password is incorrect.'
    zh-cn:
        loginError: '您未注册或者密码错误.'
</i18n>

<template>
    <ApolloMutation
            :mutation="mutation"
            :variables="{idNumber,password}"
            @done="onDone"
            #default="{mutate,loading,error}"
    >
            <center-form :title="$t('login')">
                <template #textField>
                    <v-text-field
                            prepend-icon="person"
                            name="idNumber"
                            :label="$t('idNumber')"
                            type="text"
                            mask="##################"
                            v-model="idNumber"
                            :rules="[rules.required($t('mustInput')),rules.idNumberMin($t('idNumberPrompt'))]"
                    >
                    </v-text-field>
                    <password-text-field min-char="6" v-model="password"></password-text-field>
                </template>
                <template #actionField>
                    <v-spacer></v-spacer>
                    <v-btn to="/signup" color="primary">{{$t('signUp')}}</v-btn>
                    <v-btn
                            :disabled="loading||idNumber.length<18||password.length<6"
                            @click="mutate()"
                            color="primary"
                    >
                        {{$t('login')}}
                    </v-btn>
                </template>
            </center-form>
            <v-snackbar v-if="error" multi-line top color="red" v-model="error">
                <p v-if="error">
                    {{$t('loginError')}}
                <p/>
            </v-snackbar>
    </ApolloMutation>
</template>

<script>
    import CenterForm from "../components/CenterForm"
    import PasswordTextField from "../components/PasswordTextField"
    import {LOGIN} from '../queries'
    import {USER_ID, AUTH_TOKEN, TEXT_FIELD_RULES, USER_ROLE} from "../settings";

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
                const role=resultObject.data.login.user.role;
                const token=resultObject.data.login.token;
                this.saveUserData(id,role,token);
                this.$router.push('/advice')
            },
            saveUserData(id,role,token){
                localStorage.setItem(USER_ID,id);
                localStorage.setItem(AUTH_TOKEN,token);
                sessionStorage.setItem(USER_ROLE,role);
                this.$root.$data.userId=localStorage.getItem(USER_ID);
                this.$root.$data.role=sessionStorage.getItem(USER_ROLE);
            },
        }
    }
</script>

<style scoped>

</style>