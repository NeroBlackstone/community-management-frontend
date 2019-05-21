<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        commitAdviceOrReport: 'Commit Advice Or Report'
    zhHans:
        commitAdviceOrReport: '提交意见和建议'
</i18n>
<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>{{$t('adviceAndReport')}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <message-dialog
                    v-if="$root.$data.role==='RESIDENT'"
                    @sendMessage="send($event)"
                    :title="$t('commitAdviceOrReport')" >
            </message-dialog>
        </v-toolbar>
        <advice-list></advice-list>
    </div>
</template>

<script>
    import MessageDialog from "../components/MessageDialog";
    import {CREATE_ADVICE, GET_ADVICE_BY_ROLE} from "../queries";
    import {USER_ID} from "../settings";
    import AdviceList from "../components/AdviceList";
    export default {
        name: "AdviceAndReport",
        components: {
            AdviceList,
            MessageDialog
        },
        methods:{
            send(event){
                this.createAdvice(event)
            },
            async createAdvice(message){
                await this.$apollo.mutate({
                    mutation:CREATE_ADVICE,
                    variables:{
                        id:localStorage.getItem(USER_ID),
                        title:message.title,
                        content:message.content
                    },
                    update:(store,{data:{createAdvice}})=>{
                        this.updateStoreAfterCreateAdvice(store,createAdvice);
                    }
                })
            },
            updateStoreAfterCreateAdvice(store,createAdvice){
                const data=store.readQuery({
                    query:GET_ADVICE_BY_ROLE,
                    variables:{
                        id:localStorage.getItem(USER_ID)
                    }
                });
                data.getAdvicesByRole.push(createAdvice);
                store.writeQuery({query:GET_ADVICE_BY_ROLE,variables:{id:localStorage.getItem(USER_ID)},data})
            }
        },
        /*apollo:{
            me:{
                query:ME
            }
        }*/
    }
</script>

<style scoped>

</style>