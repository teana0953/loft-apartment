<template>
    <v-data-table
        v-model="tableData.selected"
        :headers="tableData.headers"
        :items="_users"
        :show-select="tableData.showSelect"
        :single-select="tableData.singleSelect"
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Split</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="splitEqually"
                >
                    Equally
                </v-btn>
            </v-toolbar>
        </template>

        <template v-slot:body="{ items, headers }">
            <tbody>
                <tr
                    v-for="(item,idx,k) in items"
                    :key="idx"
                >
                    <td
                        v-for="(header,hidx,key) in headers"
                        :key="key"
                    >
                        <v-checkbox
                            v-if="tableData.showSelect && hidx === 0"
                            v-model="tableData.selected"
                            :value="item"
                            style="margin:0px;padding:0px"
                            hide-details
                        />
                        <span v-else-if="!header.editConfig">
                            {{item[header.value]}}
                        </span>
                        <v-edit-dialog
                            v-else
                            :return-value.sync="item[header.value + 'Edit']"
                            @save="saveCell(idx, header.value)"
                            @cancel="cancelCell(idx, header.value)"
                            @open="openCell(idx, header.value)"
                            @close="closeCell(idx, header.value)"
                            large
                        >
                            {{item[header.value + 'Edit']}}

                            <template v-slot:input>

                                <validation-observer :ref="'editCell'+idx">
                                    <validation-provider
                                        v-slot="{ errors }"
                                        :name="header.value"
                                        :rules="header.editConfig.rules || ''"
                                    >
                                        <v-text-field
                                            v-if="header.editConfig.type !== 'number'"
                                            :type="header.editConfig.type || 'text'"
                                            v-model="item[header.value + 'Edit']"
                                            label="Edit"
                                            single-line
                                            :error-messages="errors"
                                        ></v-text-field>
                                        <v-text-field
                                            v-else
                                            type="number"
                                            v-model.number="item[header.value + 'Edit']"
                                            label="Edit"
                                            single-line
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </validation-provider>
                                </validation-observer>

                            </template>
                        </v-edit-dialog>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { required, min_value } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, validate } from 'vee-validate';
import { IFriend } from '../../views/home/friend/model';

interface IUser {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    splitCost: number;
    splitCostEdit: number;
}

interface ITableHeaderEditConfig {
    type: string;
    rules?: string;
}

interface ITableHeader<T> {
    text: string;
    value: keyof T;
    editConfig?: ITableHeaderEditConfig;
    align?: 'start' | 'center' | 'end';
    sortable?: boolean;
    filterable?: boolean;
    groupable?: boolean;
    divider?: boolean;
    class?: string | string[];
    cellClass?: string | string[];
    width?: string | number;
    filter?: (value: any, search: string, item: any) => boolean;
    sort?: (a: any, b: any) => number;
}

interface ITableConfig<T> {
    singleSelect: boolean;
    selected: T[];
    headers: ITableHeader<T>[];
    items: T[];
    itemKey?: string;
    showSelect?: boolean;
}

@Component({
    components: {
        ValidationObserver,
        ValidationProvider,
    },
})
export default class SplitTable extends Vue {
    @Prop()
    users: IUser[];
    private _users: IUser[];

    @Watch('users')
    onUsersChanged(value) {
        console.log('user change', value);
        this._users = Object.assign(this._users, value);
    }

    //#region Table for split
    private tableData: ITableConfig<IUser> = {
        singleSelect: false,
        selected: [],
        headers: [
            {
                text: 'Name',
                value: 'name',
            },
            {
                text: 'Split Cost',
                value: 'splitCost',
                editConfig: {
                    type: 'number',
                    rules: 'required|min_value:0.01',
                },
            },
        ],
        items: [],
        showSelect: true,
    };

    //#endregion Table for split

    created() {
        // validate-related
        extend('required', {
            ...required,
            message: '{_field_} can not be empty',
        });
        extend('min_value', {
            ...min_value,
            message: '{_field_} should be larger than 0',
        });

        this._users = this.users || [];

        this.initTableData();
    }

    mounted() {}

    //#region Table
    initTableData() {
        this.tableData.items = this._users;
    }

    splitEqually() {}

    saveCell(idx, key) {
        let item = this._users[idx];
        item['save'] = true;
    }
    cancelCell(idx, key) {}
    openCell(idx, key) {
        let item = this._users[idx];
        item[`${key}Edit`] = item[key] || 0;
    }
    async closeCell(idx, key) {
        let item = this._users[idx];

        console.log(this.$refs);

        if (item['save']) {
            let valid = await (this.$refs[`editCell${idx}`][0] as any).validate();
            if (valid) {
                item[key] = item[`${key}Edit`];
            } else {
                item[`${key}Edit`] = item[key];
            }
        } else {
            item[`${key}Edit`] = item[key];
        }

        delete item['save'];
    }
    //#endregion Table
}
</script>

<style lang="scss" scoped>
.friends {
    height: 100%;

    &__fab {
        bottom: 1.6rem;
    }
}
</style>
