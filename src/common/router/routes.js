/**
 * 路由定义
 * author: bobochang
 */


const routes = [

    // 访问路由"/", 自动重定向到"/home"
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home.vue'),
        children: [
            // 首页
            {
                path: '', // 默认路径
                name: 'index',
                component: () => import('@/views/index/index.vue')
            },
            // 用户列表
            {
                path: '/user/index',
                name: 'userList',
                component: () => import('@/views/user/index.vue'),
                meta: {nav: ['用户管理', '用户列表']}
            },
            // 用户列表-修改权限
            {
                path: '/user/auth-update',
                name: 'userAuthUpdate',
                component: () => import('@/views/user/auth-update.vue'),
                meta: {nav: ['用户管理', '用户列表', '更改权限']}
            },
            // 角色列表
            {
                path: '/role/index',
                name: 'roleList',
                component: () => import('@/views/role/index.vue'),
                meta: {nav: ['角色管理', '角色列表']}
            },
            // 角色列表-修改权限
            {
                path: '/role/auth-update',
                name: 'roleAuthUpdate',
                component: () => import('@/views/role/auth-update.vue'),
                meta: {nav: ['角色管理', '角色列表', '更改权限']}
            },
            // 权限树
            {
                path: '/auth/index',
                name: 'authList',
                component: () => import('@/views/auth/index.vue'),
                meta: {nav: ['权限管理', '权限列表']}
            },
            // 材料列表
            {
                path: '/commodity/index',
                name: 'commodityList',
                component: () => import('@/views/commodity/index/index.vue'),
                meta: {nav: ['材料管理', '材料列表']}
            },
            // 采购列表
            {
                path: '/purchase/index',
                name: 'purchaseList',
                component: () => import('@/views/purchase/index.vue'),
                meta: {nav: ['采购管理', '采购列表']}
            },
            // 入库列表
            {
                path: '/instore/index',
                name: 'instoreList',
                component: () => import('@/views/instore/index.vue'),
                meta: {nav: ['入库管理', '入库列表']}
            },
            // 出库列表
            {
                path: '/outstore/index',
                name: 'outstoreList',
                component: () => import('@/views/outstore/index.vue'),
                meta: {nav: ['出库管理', '出库列表']}
            },
            // 调货单列表
            {
                path: '/transshipment/index',
                name: 'transshipmentList',
                component: () => import('@/views/transshipment/index.vue'),
                meta: {nav: ['调货管理', '调货单列表']}
            },
            // 调货列表
            {
                path: '/transshipment/transfer',
                name: 'transferList',
                component: () => import('@/views/transshipment/transfer-list.vue'),
                meta: {nav: ['调货管理', '调货列表']}
            },
            // 产品列表
            {
                path: '/product/index',
                name: 'productList',
                component: () => import('@/views/product/index.vue'),
                meta: {nav: ['产品管理', '产品列表']}
            },
            // 仓库列表
            {
                path: '/store/index',
                name: 'storeList',
                component: () => import('@/views/store/index.vue'),
                meta: {nav: ['仓库管理', '仓库列表']}
            },
            // 合同列表
            {
                path: '/contract/index',
                name: 'contractList',
                component: () => import('@/views/contract/index.vue'),
                meta: {nav: ['合同管理', '合同列表']}
            },
            {
                path: '/attendance/index',
                name: 'attendanceList',
                component: () => import('@/views/attendance/index.vue'),
                meta: {nav: ['考勤管理', '考勤列表']}
            },
            {
                path: '/activiti/index',
                name: 'activitiList',
                component: () => import('@/views/Activiti/index.vue'),
            },
            {
                path: '/task/index',
                name: 'taskList',
                component: () => import('@/views/task/index.vue'),
                meta: {nav: ['任务中心', '任务列表']}
            },
            {
                path: '/supply/index',
                name: 'supplyList',
                component: () => import('@/views/supply/index.vue'),
                meta: {nav: ['供应商管理', '供应商列表']}
            },
            {
                path: '/ratio/index',
                name: 'ratioList',
                component: () => import('@/views/ratio/index.vue'),
                meta: {nav: ['产品材料比例管理', '产品材料比例列表']}
            },
            {
                path: '/settlement/index',
                name: 'settlementList',
                component: () => import('@/views/settlement/index.vue'),
                meta: {nav: ['结算管理', '合同结算列表']}
            },
            {
                path: '/controller/index',
                name: 'controllerList',
                component: () => import('@/views/controller/index.vue'),
                meta: {nav: ['工作台', '工作面板']}
            },
            {
                path: '/summary/out',
                name: 'outSummaryList',
                component: () => import('@/views/summary/out-summary.vue'),
                meta: {nav: ['汇总管理', '项目结算情况汇总表']}
            },
            {
                path: '/summary/in',
                name: 'inSummaryList',
                component: () => import('@/views/summary/in-summary.vue'),
                meta: {nav: ['汇总管理', '供应商结算应付汇总表']}
            },
            {
                path: '/provide/index',
                name: 'provideList',
                component: () => import('@/views/provide/index.vue'),
                meta: {nav: ['供应商管理', '供应商材料']}
            },
            {
                path: '/contract/engineering/index',
                name: 'provideList',
                component: () => import('@/views/contract/engineering/index.vue'),
            },
            {
                path: '/buslog/index',
                name: 'buslogList',
                component: () => import('@/views/buslog/index.vue'),
            },
            {
                path: '/inspect/index',
                name: 'inspectList',
                component: () => import('@/views/inspect/index.vue'),
                meta: {nav: ['检验管理', '检验列表']}
            },
            {
                path: '/salary/index',
                name: 'inspectList',
                component: () => import('@/views/salary/index.vue'),
                meta: {nav: ['工资管理', '工资列表']}
            },
        ]
    },
    {
        path: '/login',
        name: "Login",
        component: () => import('@/views/login.vue')
    },
    {
        path: '/404',
        name: "NotFound",
        component: () => import('@/views/404.vue')
    },


];

// 判断路由是否存在
const existsRoute_inner = (path, theRoutes) => {
    for (let i = 0; i < theRoutes.length; i++) {
        const r = theRoutes[i];
        if (r.path == path) {
            return true;
        }
        if (r.children && r.children.length) {
            const existsInChildren = existsRoute_inner(path, r.children);
            if (existsInChildren) return true;
        }
    }
    return false;
};

export const existsRoute = (path) => {

    return existsRoute_inner(path, routes);

};

export default routes;