<i18n src="../../locales.yaml"></i18n>

<template>
    <ApolloMutation
            :mutation="mutation"
            :variables="{name,idNumber,phoneNumber,password}"
            @done="onDone"
            #default="{mutate,loading,error}"
    >
            <center-form :title="$t('signUp')">
                <template #textField>
                    <v-text-field
                            prepend-icon="person"
                            name="userName"
                            :label="$t('userName')"
                            type="text"
                            v-model="name"
                            :rules="[() => !!name || $t('mustInput')]"
                    >
                    </v-text-field>
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
                    <v-text-field
                            prepend-icon="phone"
                            name="phoneNumber"
                            :label="$t('phoneNumber')"
                            type="text"
                            mask="###########"
                            v-model="phoneNumber"
                            :rules="[rules.required($t('mustInput')),rules.phoneNumberMin($t('phoneNumberPrompt'))]"
                    >
                    </v-text-field>
                    <password-text-field min-char="6" v-model="password"></password-text-field>
                </template>

                <template #actionField>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="loading||name.length===0||idNumber.length<18||phoneNumber.length<11||
                            password.length<6"
                            @click="mutate()"
                            color="primary"
                    >
                        {{$t('signUp')}}
                    </v-btn>
                </template>
            </center-form>
            <v-snackbar multi-line top color="red" v-model="error">
                <p v-if="error">{{error}}<p/>
            </v-snackbar>
    </ApolloMutation>
</template>

<script>
    import CenterForm from "../components/CenterForm"
    import PasswordTextField from "../components/PasswordTextField"
    import SIGN_UP from "../graphql/mutation/SignUp.gql";
    import {USER_ID,AUTH_TOKEN,TEXT_FIELD_RULES,USER_ROLE} from "../settings";
    export default {
        name: "SignUpForm",
        components:{
            PasswordTextField,
            CenterForm
        },
        data(){
            return{
                mutation:SIGN_UP,
                name:'',
                idNumber:'',
                phoneNumber:'',
                password:'',
                showPassword:false,
                rules:TEXT_FIELD_RULES
            }
        },
        methods:{
            onDone(resultObject){
                const id=resultObject.data.signup.user.id;
                const role=resultObject.data.signup.user.role;
                const token=resultObject.data.signup.token;
                this.saveUserData(id,role,token);
                this.$router.push('/activity')
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