<template>
  <aside class="sidebar">
    <div class="logo">
      <img alt="Logo" src="@/assets/Logoditis.png" width="40" height="40" />
    </div>
    <nav>
      <RouterLink to="/" class="nav-item">
        <Home class="icon" />
        <span>Início</span>
      </RouterLink>
      <RouterLink to="/salas" class="nav-item">
        <Users class="icon" />
        <span>Salas</span>
      </RouterLink>
      <RouterLink to="/reunioes" class="nav-item">
        <Calendar class="icon" />
        <span>Reuniões</span>
      </RouterLink>
    </nav>
    <div class="profile">
      <button @click="toggleProfileMenu" class="profile-button">
        <UserCircle class="icon" />
        <span>Perfil</span>
      </button>
      <div v-if="showProfileMenu" class="profile-menu">
        <RouterLink to="/perfil" class="menu-item">Editar Perfil</RouterLink>
        <button @click="logout" class="menu-item logout">
          <LogOut class="icon" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { UserCircle, LogOut, Calendar, Home, Users } from 'lucide-vue-next'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const showProfileMenu = ref(false)
const router = useRouter() 

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const logout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    localStorage.removeItem('token')
    toast.success("Logout realizado com sucesso!", { autoClose: 10000 });
    router.push('/login') 
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    toast.error("Erro ao fazer logout!", { autoClose: 10000});
  }
}
</script>


<style scoped>

.logo {
  margin-bottom: 4rem;
  text-align: center;
}

.logo img {
  width: 150px; /* Aumente este valor conforme necessário */
  height: auto; /* Mantém a proporção da imagem */
}

.sidebar {
  width: 250px;
  background-color: #f3f4f6;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.logo {
  margin-bottom: 2rem;
  text-align: center;
}

nav {
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.nav-item:hover,
.nav-item.router-link-active {
  background-color: #e5e7eb;
}

.icon {
  margin-right: 0.75rem;
}

.profile {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #374151;
}

.profile-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: block;
  padding: 0.75rem;
  color: #374151;
  text-decoration: none;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.logout {
  color: #ef4444;
  display: flex;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
