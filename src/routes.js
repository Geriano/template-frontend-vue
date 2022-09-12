import DashboardLayout from './Layouts/DashboardLayout.vue'
import Dashboard from './Pages/Dashboard.vue'
import Profile from './Pages/Auth/Profile.vue'
import SuperuserPermission from './Pages/Superuser/Permission.vue'
import SuperuserRole from './Pages/Superuser/Role.vue'
import SuperuserUser from './Pages/Superuser/User.vue'
import SuperuserMenu from './Pages/Superuser/Menu.vue'

import AuthLayout from './Layouts/AuthLayout.vue'
import Login from './Pages/Auth/Login.vue'
import Register from './Pages/Auth/Register.vue'

import NotFound from './Pages/NotFound.vue'

export default [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', name: 'home', component: Dashboard, },
      { path: '/profile', name: 'profile', component: Profile },
      { path: '/superuser/permission', name: 'superuser.permission', component: SuperuserPermission },
      { path: '/superuser/role', name: 'superuser.role', component: SuperuserRole },
      { path: '/superuser/user', name: 'superuser.user', component: SuperuserUser },
      { path: '/superuser/menu', name: 'superuser.menu', component: SuperuserMenu },
    ],
  },

  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '/login', name: 'login', component: Login },
      { path: '/register', name: 'register', component: Register },
    ],
  },

  {
    path: '/:any',
    component: NotFound,
  },
]