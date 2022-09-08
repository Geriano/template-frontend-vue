import DashboardLayout from './Layouts/DashboardLayout.vue'
import Dashboard from './Pages/Dashboard.vue'
import Profile from './Pages/Auth/Profile.vue'
import SuperuserPermission from './Pages/Superuser/Permission.vue'

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
      { path: '/role', name: 'role', component: Profile },
      { path: '/user', name: 'user', component: Profile },
      { path: '/superuser/permission', name: 'superuser.permission', component: SuperuserPermission }
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