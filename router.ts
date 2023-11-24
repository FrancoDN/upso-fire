// router.ts
import Vue from 'vue';
import VueRouter, { NavigationGuard } from 'vue-router';
import HelloWorld from './src/components/HelloWorld.vue'
import Home from './src/Home.vue'
import Registro from './src/components/Registro.vue'
import { auth } from './firebaseConfig';

Vue.use(VueRouter);


// Guardia de navegación para verificar la autenticación
const requireAuth: NavigationGuard = function (to, from, next) {
  const isAuthenticated = auth.currentUser;

  if (isAuthenticated) {
    // Si el usuario está autenticado, permite el acceso a la ruta
    next();
  } else {
    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    next('/');
  }
};

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/registro', component: Registro },
  {
    path: '/home',
    component: Home,
    beforeEnter: requireAuth as NavigationGuard, // Utiliza el guard requireAuth para proteger la ruta
  },
];

const router = new VueRouter({
  routes,
});

export default router;
