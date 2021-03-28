export enum ERouterName {
    login = 'login',
    home = 'home',

    friends = 'friends',
    addFriends = 'addFriends',
    friendDetail = 'friendDetail',
    friendExpenseDetail = 'friendExpenseDetail',
    friendExpenseDetailEdit = 'friendExpenseDetailEdit',

    groups = 'groups',
    createGroup = 'createGroup',
    groupDetail = 'groupDetail',

    activity = 'activity',

    settings = 'settings',
}

export enum ERouterUrl {
    login = '/login',
    home = '/home',

    friends = '/friends',
    addFriends = '/friends/add',
    friendDetail = '/friends/detail/:id',
    friendExpenseDetail = '/friends/expense/:expenseId',
    friendExpenseDetailEdit = '/friends/expense/:expenseId/edit',
    
    groups = '/groups',
    createGroup = '/groups/create',
    groupDetail = '/groups/detail/:id',
    

    activity = '/activity',

    settings = '/settings'
}