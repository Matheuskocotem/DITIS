import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/resetPassword/:token',
    name: 'resetPassword',
    component: () => import('../views/auth/ResetPassword.vue'),
    props: route => ({
      token: route.params.token,
      email: route.params.email
    }),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
    meta: {
      title: 'login',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/auth/ForgotPassword.vue'),
    meta: {
      title: 'esqueci minha senha',
    },
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/Register.vue'),
    meta: {
      title: 'register',
    },
  },
  {
    path: '/salas',
    name: 'salas',
    component: () => import('../views/user/Rooms.vue'),
    meta: {
      title: 'salas',
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/reunioes',
    name: 'Reunioes',
    component: () => import('../views/user/Meetings.vue'),
    meta: {
      title: 'VizualiazarReunioes',
      requiresAuth: true,
      role: 'user',
    },
  },
  {
    path: '/admindash',
    name: 'admindash',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: {
      title: 'admindash',
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/roomsAdmin',
    name: 'roomsAdmin',
    component: () => import('../views/admin/Rooms.vue'),
    meta: {
      title: 'roomsAdmin',
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/meetingsadmin',
    name: 'meetingsadmin',
    component: () => import('../views/admin/Meetings.vue'),
    meta: {
      title: 'meetingsAdmin',
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/useradmin',
    name: 'useradmin',
    component: () => import('../views/Users.vue'),
    meta: {
      title: 'useradmin',
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/bad-request',
    name: 'BadRequest',
    component: () => import('../views/BadRequest.vue'),
    meta: {
      title: 'Acesso Negado',
    },
  },
  {
    path: '/',
    name: 'VizualiazarReunioes',
    component: () => import('../views/reunioes.vue'),
    meta: {
      title: 'calendario',
      requiresAuth: true,
      role: 'user',
    },
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;

  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      if (to.meta.role && to.meta.role !== userRole) {
        next({ name: 'BadRequest' });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
