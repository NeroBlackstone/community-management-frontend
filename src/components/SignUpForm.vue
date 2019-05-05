<template>
    <ApolloMutation
            :mutation="mutation"
            :variables="{name,idNumber,phoneNumber,password}"
            @done="onDone"
            #default="{mutate,loading,error}"
    >
            <center-form title="SignUp">
                <template #textField>
                    <v-text-field
                            prepend-icon="person"
                            name="userName"
                            label="UserName"
                            type="text"
                            v-model="name"
                            :rules="[() => !!name || 'This field is required']"
                    >
                    </v-text-field>
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
                    <v-text-field
                            prepend-icon="phone"
                            name="phoneNumber"
                            label="PhoneNumber"
                            type="text"
                            mask="###########"
                            v-model="phoneNumber"
                            :rules="[rules.required,rules.phoneNumberMin]"
                    >
                    </v-text-field>
                    <password-text-field min-char="6" v-model="password"></password-text-field>
                </template>

                <template #actionField>
                    <v-spacer></v-spacer>
                    <v-btn
                            :disabled="loading||name.length===0||idNumber.length<18||phoneNumber.length<11||password.length<6"
                            @click="mutate()"
                            color="primary"
                    >
                        SignUp
                    </v-btn>
                </template>
            </center-form>
            <v-snackbar multi-line top color="red" v-model="error">
                <p v-if="error">
                    {{error}}
                <p/>
            </v-snackbar>
    </ApolloMutation>
</template>

<script>
    import CenterForm from "./CenterForm"
    import PasswordTextField from "./PasswordTextField"
    import {SIGN_UP} from "../queries";
    import {USER_ID,AUTH_TOKEN,TEXT_FIELD_RULES} from "../settings";
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
                const token=resultObject.data.signup.token;
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