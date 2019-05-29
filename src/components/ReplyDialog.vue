<i18n>
    en:
        yourReply: 'Your Reply'
    zhHans:
        yourReply: '你的回复'
</i18n>

<template>
    <v-dialog v-model="dialog">
        <template #activator="{on}">
            <!--fab:使用圆形按钮-->
            <v-btn large fixed bottom right fab color="primary" v-on="on">
                <v-icon>add</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-toolbar card color="pink" dark>
                <v-icon @click="dialog=false">arrow_back</v-icon>
                <v-toolbar-title>{{title}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon v-show="!message.isBlank()" @click="send">
                    send
                </v-icon>
            </v-toolbar>

            <v-form>
                <v-textarea
                        class="justify-center layout px-2"
                        :label="$t('yourReply')"
                        counter
                        maxlength="120"
                        single-line
                        v-model="message"
                >
                </v-textarea>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "ReplyDialog",
        props:["title"],
        data:()=>({
            dialog:false,
            message:''
        }),
        methods:{
            send(){
                this.dialog=false;
                this.$emit('sendReply',this.message);
                this.message='';
            }
        }
    }
</script>

<style scoped>

</style>