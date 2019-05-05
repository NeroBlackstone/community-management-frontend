<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>{{title}}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <slot name="textField"></slot>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <slot name="actionField"></slot>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "CenterForm",
        props:['title']
    }
</script>

<style scoped>

</style>