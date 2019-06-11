<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        passwordPrompt: 'Password requires at least {digit} digits'
    zhHans:
        passwordPrompt: '密码至少需要{digit}位'
 </i18n>

<template>
    <v-text-field
            prepend-icon="lock"
            name="password"
            :label="$t('password')"
            id="password"
            :type="showPassword ? 'text' : 'password'"
            counter
            :append-icon="showPassword ? 'visibility':'visibility_off'"
            :rules="[rules.required,rules.min]"
            @click:append="showPassword=!showPassword"
            :value="value"
            @input="$emit('input', $event)"
    >
    </v-text-field>
</template>

<script>
    import {TEXT_FIELD_RULES} from '../settings'
    export default {
        name: "PasswordTextField",
        props:['value','minChar'],
        data(){
            return {
                showPassword:false,
                rules:{
                    required:TEXT_FIELD_RULES.required(this.$t('mustInput')),//value=>!!value||this.$t('required'),
                    min:v=>v.length>=this.minChar||this.$t('passwordPrompt',{digit:this.minChar})
                },
            }
        },
    }
</script>

<style scoped>

</style>