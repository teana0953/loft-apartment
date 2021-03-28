<template>
    <div class="home">
        Home
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DataCenter from '../store/data-center';
import { concatMap } from 'rxjs/operators';
import { IStoreModel } from '@/store/models';
import { ServiceWorkerService } from '@/helper';

@Component({
    components: {},
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.main {
    padding: 1.4rem;
}
</style>
