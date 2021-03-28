<template>
    <div class="person-card">
        <b-card
            :title="person.name"
            tag="article"
            class="person-card__side person-card__side mb-4"
            :class="{'person-card__side--flip': needFlip}"
        >
            <b-card-text>
                <div class="person-info__photo d-flex align-items-center mb-4">
                    <b-avatar
                        class="mr-3"
                        size="6em"
                        :src="person.photo"
                    ></b-avatar>
                    <span class="mr-auto">{{person.employeeId}}</span>
                </div>
                <div class="person-info__remark">
                    {{ person.remark }}
                </div>
            </b-card-text>
        </b-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Utility } from '../../helper';

export interface IPerson {
    id: string;
    name: string;
    employeeId: string;
    photo: string;
    remark?: string;
}

@Component
export default class PersonCard extends Vue {
    @Prop()
    private person: IPerson;

    private needFlip: boolean = false;

    private OnFlip(id: string) {
        if (id === this.person.id) {
            this.FlipCard();
        }
    }

    /**
     *
     */
    public async FlipCard(): Promise<void> {
        this.needFlip = true;

        await Utility.Delay(1000);

        this.needFlip = false;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.person-card {
    perspective: 150rem;
    -moz-perspective: 150rem;
    position: relative;
    height: 20rem;

    max-width: 20rem;
    width: 20rem;
    min-width: 20rem;

    &__side {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 20rem;

        // backface-visibility: hidden;
        transform-style: preserve-3d;

        &--flip {
            animation-name: flip;
            animation-duration: 1s;
            animation-timing-function: ease;
            animation-fill-mode: forwards;
        }
    }

    @keyframes flip {
        0% {
            transform: rotateY(0);
        }

        30% {
            transform: rotateY(90deg);
        }

        60% {
            transform: rotateY(180deg);
        }

        100% {
            transform: rotateY(360deg);
        }
    }
}
</style>
