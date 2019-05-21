<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        yourAdviceOrReport: 'Your advice or report...'
    zhHans:
        yourAdviceOrReport: '你的意见或是举报'
</i18n>
<template>
    <v-dialog v-model="dialog">
        <template #activator="{on}">
            <v-btn color="primary" v-on="on">{{title}}</v-btn>
        </template>
        <v-card>
            <v-toolbar card color="pink" dark>
                <v-icon @click="dialog=false">arrow_back</v-icon>
                <v-toolbar-title>{{title}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon v-show="!(message.title.isBlank()||message.content.isBlank())" @click="send">
                    send
                </v-icon>
            </v-toolbar>

            <v-form>
                <!--hide-details:Hides hint, validation errors -->
                <!--single-line:Label does not move on focus/dirty-->
                <v-text-field
                        class="justify-center layout px-2"
                        :label="$t('title')"
                        single-line
                        hide-details
                        v-model="message.title"
                >
                </v-text-field>
                <v-divider></v-divider>
                <v-textarea
                        class="justify-center layout px-2"
                        :label="$t('yourAdviceOrReport')"
                        counter
                        maxlength="120"
                        single-line
                        v-model="message.content"
                >
                </v-textarea>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "MessageDialog",
        props:["title"],
        data:()=>({
            dialog:false,
            message:{
                title:'',
                content:''
            }
        }),
        methods:{
            send(){
                this.dialog=false;
                this.$emit('sendMessage',this.message);
                this.message.title='';
                this.message.content='';
            }
        }
    }
</script>

<style scoped>

</style>