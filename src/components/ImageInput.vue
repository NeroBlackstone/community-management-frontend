<template>
    <div>
        <div class="image-input">
            <label for="field-image">Image</label>
            <input
                    id="field-image"
                    type="file"
                    accept="image/*"
                    required
                    @change="onUploadImage"
            >
        </div>
        <div class="images">
            <div
                    v-for="file of files"
                    :key="file.id"
                    class="image-item"
            >
                <img :src="`${$filesRoot}/${file.path}`" class="image"/>
            </div>
        </div>
    </div>
</template>

<script>
    import FILES from '../graphql/query/Files.gql'
    import UPLOAD_FILE from '../graphql/mutation/UploadFile.gql'
    export default {
        name: "ImageInput",
        methods:{
            async onUploadImage ({ target }) {
                if (!target.validity.valid) return;
                await this.$apollo.mutate({
                    mutation:
                    UPLOAD_FILE,
                    variables: {
                        file: target.files[0],
                    },
                    update: (store, { data: { singleUpload } }) => {
                        const data = store.readQuery({ query: FILES });
                        data.files.push(singleUpload);
                        store.writeQuery({ query: FILES, data })
                    },
                })
            }
        },
        apollo: {
            files: FILES,
        },

    }
</script>

<style scoped>

</style>