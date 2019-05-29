<i18n src="../../locales.yaml"></i18n>
<i18n>
    en:
        sendReply: 'Send Reply'
    zhHans:
        sendReply: '发送回复'
</i18n>
<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>{{$t('adviceAndReport')}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-timeline>
            <ApolloQuery
                    :query="queryAdvice"
                    :variables="{id:$route.params.id}"
                    #default="{result:{loading,error,data}}"
            >
                <v-timeline-item
                        color="red"
                        v-if="data"
                >
                    <template #opposite>
                        <span>{{$t('resident')}}: {{data.advice.owner.name}}</span>
                    </template>
                    <v-card >
                        <v-card-title>{{data.advice.title}}</v-card-title>
                        <v-card-text>{{data.advice.content}}</v-card-text>
                    </v-card>
                </v-timeline-item>
            </ApolloQuery>
            <ApolloQuery
                    :query="queryComments"
                    :variables="{id:$route.params.id}"
                    #default="{result:{loading,error,data}}"
            >
                <ApolloSubscribeToMore
                        :document="subscription"
                        :variables="{adviceId: $route.params.id}"
                        :update-query="onCommentAdded"
                >
                </ApolloSubscribeToMore>
                <div v-if="data">
                    <v-timeline-item
                            v-for="comment in data.comments"
                            :key="comment.id"
                            :color="comment.owner.role==='RESIDENT' ? 'red' : 'blue'"
                            :left="comment.owner.role==='RESIDENT'"
                            :right="comment.owner.role!=='RESIDENT'"
                    >
                        <template #opposite>
                            <span v-if="comment.owner.role==='RESIDENT'">
                                    {{$t('resident')}}: {{comment.owner.name}}
                            </span>
                            <span v-else-if="comment.owner.role==='WORKER'">
                                    {{$t('worker')}} : {{comment.owner.name}}
                            </span>
                            <span v-else-if="comment.owner.role==='MANAGER'">
                                    {{$t('manager')}} : {{comment.owner.name}}
                            </span>
                        </template>
                        <v-card>
                            <v-card-text>{{comment.content}}</v-card-text>
                        </v-card>
                    </v-timeline-item>
                </div>
            </ApolloQuery>
        </v-timeline>
        <reply-dialog @sendReply="send"></reply-dialog>
    </div>
</template>

<script>
    import CREATE_REPLY_FOR_ADVICE from "../graphql/mutation/CreateReplyForAdvice.gql";
    import ADVICE_AND_OWNER from '../graphql/query/AdviceAndOwner.gql'
    import COMMENTS_OF_ADVICE from '../graphql/query/CommentsOfAdvice.gql'
    import ReplyDialog from "../components/ReplyDialog";
    import {USER_ID} from "../settings";
    import CREATE_COMMENT_SUBSCRIPTION from '../graphql/subscription/CreateCommentSubscription.gql'
    export default {
        name: "AdviceDetail",
        components:{
            ReplyDialog,
        },
        data:()=>({
            queryAdvice:ADVICE_AND_OWNER,
            queryComments:COMMENTS_OF_ADVICE,
            subscription:CREATE_COMMENT_SUBSCRIPTION
        }),
        methods:{
            send(event){
                this.createComment(event);
            },
            async createComment(message){
                await this.$apollo.mutate({
                    mutation:CREATE_REPLY_FOR_ADVICE,
                    variables:{
                        ownerId:localStorage.getItem(USER_ID),
                        adviceId:this.$route.params.id,
                        comment:message
                    },
                })
            },
            onCommentAdded(previousResult,{subscriptionData}){
                const newResult={
                    comments: [...previousResult.comments]
                };
                newResult.comments.push(subscriptionData.data.comment.node);
                setTimeout(()=>window.scrollTo(0,document.body.scrollHeight),0);
                return newResult
            }
        }
    }
</script>

<style scoped>

</style>