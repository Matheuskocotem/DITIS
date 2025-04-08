<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <img alt="Logo" src="@/assets/Logoditis.png" class="logo-image" />
      </div>
      <div class="toggle-menu-btn d-md-none">
        <i class="fas fa-bars"></i>
      </div>
    </div>
    
    <div class="user-profile">
      <div class="avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-info">
        <h3 class="user-name">Admin</h3>
        <p class="user-role">Administrador</p>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 class="nav-title">Menu Principal</h4>
        
        <RouterLink to="/dashboard" class="nav-item">
          <i class="fas fa-home icon"></i>
          <span>Dashboard</span>
        </RouterLink>
        
        <RouterLink to="/useradmin" class="nav-item">
          <i class="fas fa-users icon"></i>
          <span>Usuários</span>
        </RouterLink>
        
        <RouterLink to="/roomsAdmin" class="nav-item">
          <i class="fas fa-building icon"></i>
          <span>Salas</span>
        </RouterLink>
        
        <RouterLink to="/meetingsadmin" class="nav-item">
          <i class="fas fa-calendar-alt icon"></i>
          <span>Reuniões</span>
        </RouterLink>
      </div>
      
      <div class="nav-section">
        <h4 class="nav-title">Configurações</h4>
        
        <RouterLink to="/profile" class="nav-item">
          <i class="fas fa-user-cog icon"></i>
          <span>Meu Perfil</span>
        </RouterLink>
        
        <button @click="logout" class="nav-item logout-btn">
          <i class="fas fa-sign-out-alt icon"></i>
          <span>Sair</span>
        </button>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <p class="version">DITIS v2.0</p>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { apiLogout } from "@/http";

const router = useRouter();

const logout = async () => {
  try {
    await apiLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  } catch (error) {
    toast.error(`Erro ao fazer logout: ${error.response?.data?.message || "Erro desconhecido"}`);
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  width: 250px;
  height: 100vh;
  background-color: white;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.toggle-menu-btn {
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.25rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 0.75rem 0.5rem;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.nav-item:hover {
  background-color: var(--bg-light);
  color: var(--primary);
}

.nav-item.router-link-active {
  background-color: var(--primary-light);
  color: var(--primary);
}

.router-link-active .icon {
  color: var(--primary);
}

.icon {
  margin-right: 0.75rem;
  width: 18px;
  text-align: center;
  transition: color 0.2s;
}

.logout-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--danger);
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: var(--danger-light);
}

.logout-btn .icon {
  color: var(--danger);
}

.sidebar-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.version {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
