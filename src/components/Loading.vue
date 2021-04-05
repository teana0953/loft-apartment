<template>
    <v-overlay>
        <v-progress-circular
            indeterminate
            color="primary"
            size="64"
        ></v-progress-circular>
    </v-overlay>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class Loading extends Vue {}
</script>

<style lang="scss" scoped>
</style>
