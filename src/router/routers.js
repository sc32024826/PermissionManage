import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/',
        name: '_home',
        component: Main,
        meta: {
            icon: 'md-home',
            hideInMenu: true,
            notCache: true
        },
        children: [{
            path: '/home',
            name: 'home',
            meta: {
                title: '首页',
                notCache: true,
                icon: 'md-home'
            },
            component: () => import('@/view/single-page/home')
        }]
    },
    {
        path: '/welcome',
        name: 'welcome',
        meta: {
            notCache: true,
            title: '欢迎页',
            icon: 'md-home'
        },
        component: () => import('@/views/welcome/index')
    },
    {
        path: '/permission',
        name: 'permission',
        component: Main,
        meta: {
            title: '权限',
            notCache: true,
            requiresAuth: true,
            icon: 'md-home',
            role: 'testrole'
        },
        children: [
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '用户管理',
                    notCache: true,
                    icon: 'md-home',
                    role: 'testrole',
                    requiresAuth: true
                },
                component: () => import('@/views/permissions/user')
            },
            {
                path: '/menu',
                name: 'menu',
                meta: {
                    title: '菜单管理',
                    notCache: true,
                    requiresAuth: true,
                    icon: 'md-home',
                    role: 'testrole'
                },
                component: () => import('@/views/permissions/menu')
            },
            {
                path: '/manage',
                name: 'manage',
                meta: {
                    title: '权限组分配',
                    notCache: true,
                    requiresAuth: true,
                    icon: 'md-home',
                    role: 'testrole'
                },
                component: () => import('@/views/permissions/Role')
            }
        ]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    },
    {
        path: '/error_logger',
        name: 'error_logger',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        component: Main,
        children: [
            {
                path: 'error_logger_page',
                name: 'error_logger_page',
                meta: {
                    icon: 'ios-bug',
                    title: '错误收集'
                },
                component: () => import('@/view/single-page/error-logger.vue')
            }
        ]
    },
    {
        path: '/callback',
        name: ' callback',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        component: () => import('@/views/Oidc/callback.vue')
    },
    {
        path: '/renew',
        name: 'renew',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        component: () => import('@/views/Oidc/silent-renew.vue')
    }
]
