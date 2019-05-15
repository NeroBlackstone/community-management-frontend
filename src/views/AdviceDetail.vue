<template>
    <div>
        <v-toolbar>
            <v-toolbar-title>意见和举报</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <reply-dialog @sendReply="send($event)" title="发送回复"></reply-dialog>
        </v-toolbar>
        <ApolloQuery :query="queryAdvice" :variables="{id:$route.params.id}" #default="{result:{loading,error,data}}">
            <div v-if="data">
                <v-card class="mx-auto" color="#26c6da" dark max-width="800">
                    <v-card-title>
                        <span class="title font-weight-light">{{data.advice.title}}</span>
                    </v-card-title>
                    <v-card-text class="headline font-weight-bold">{{data.advice.content}}</v-card-text>
                    <v-card-actions>
                        <span>来自于居民: {{data.advice.owner.name}}</span>
                    </v-card-actions>
                </v-card>
            </div>
        </ApolloQuery>
        <ApolloQuery :query="queryComments" :variables="{id:$route.params.id}" #default="{result:{loading,error,data}}">
            <div v-if="data">
                <div v-for="comment in data.comments" :key="comment.id">
                    <v-card class="mx-auto" color="pink" dark max-width="800">
                        <v-card-title>
                            <span class="title font-weight-light">回复</span>
                        </v-card-title>
                        <v-card-text class="headline font-weight-bold">{{comment.content}}</v-card-text>
                        <v-card-actions >
                            <span v-if="comment.owner.role==='RESIDENT'">
                                来自居民的回复 : {{comment.owner.name}}
                            </span>
                            <span v-else-if="comment.owner.role==='WORKER'">
                                来自于工作人员的回复 : {{comment.owner.name}}
                            </span>
                            <span v-else-if="comment.owner.role==='MANAGER'">
                                来自于管理员的回复 : {{comment.owner.name}}
                            </span>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
        </ApolloQuery>
    </div>
</template>

<script>
    import {ADVICE_AND_OWNER, ALL_COMMENTS_OF_ADVICE, CREATE_COMMENT_FOR_ADVICE} from "../queries";
    import ReplyDialog from "../components/ReplyDialog";
    import {USER_ID} from "../settings";
    export default {
        name: "AdviceDetail",
        components:{
            ReplyDialog,
        },
        data:()=>({
            queryAdvice:ADVICE_AND_OWNER,
            queryComments:ALL_COMMENTS_OF_ADVICE
        }),
        methods:{
            send(event){
                this.createComment(event);
            },
            async createComment(message){
                await this.$apollo.mutate({
                    mutation:CREATE_COMMENT_FOR_ADVICE,
                    variables:{
                        ownerId:localStorage.getItem(USER_ID),
                        adviceId:this.$route.params.id,
                        comment:message
                    },
                    update:(store,{data:{createComment}})=>{
                        this.updateStoreAfterCreateComment(store,createComment);
                    },
                })
            },
            updateStoreAfterCreateComment(store,createComment){
                const data=store.readQuery({
                    query:ALL_COMMENTS_OF_ADVICE,
                    variables:{id:this.$route.params.id}
                });
                data.comments.push(createComment);
                store.writeQuery({query:ALL_COMMENTS_OF_ADVICE,variables:{id:this.$route.params.id},data});
            }
        }
    }
</script>

<style scoped>

</style>