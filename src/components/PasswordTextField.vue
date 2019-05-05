<template>
    <v-text-field
            prepend-icon="lock"
            name="password"
            label="Password"
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
    export default {
        name: "PasswordTextField",
        props:['value','minChar'],
        data(){
            return {
                showPassword:false,
                rules:{
                    required:value=>!!value||'Required',
                    min:v=>v.length>=this.minChar||`Password must have at least ${this.minChar} characters`,
                },
            }
        },
    }
</script>

<style scoped>

</style>