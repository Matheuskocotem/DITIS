<template>
  <div class="manage-users">
    <AdminSidebar />
    
    <div class="content-wrapper">
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="fas fa-users"></i> Gerenciar Usuários
          </h1>
          <p class="page-description">Cadastre, edite e gerencie os usuários do sistema</p>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-primary" @click="openModal">
            <i class="fas fa-user-plus"></i>
            Adicionar Usuário
          </button>
        </div>
      </header>

      <main class="page-content">
        <div class="card">
          <DataTable
            :columns="tableColumns"
            :items="filteredUsers.length > 0 || searchTerm ? filteredUsers : users"
            :loading="isLoading"
            :pagination="true"
            :initialItemsPerPage="10"
            :hasActions="true"
            searchPlaceholder="Buscar por nome, email ou CPF..."
            @search="handleSearch"
          >
            <!-- Slot para ações na linha da tabela -->
            <template #row-actions="{ item }">
              <button 
                class="action-btn edit-btn" 
                @click="editUser(item)"
                :disabled="enableActionButtons(item.id)"
                title="Editar"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="action-btn delete-btn" 
                @click="deleteUser(item.id)"
                :disabled="enableActionButtons(item.id)"
                title="Excluir"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </template>
            
            <!-- Formatação personalizada para a coluna role -->
            <template #role="{ value }">
              <span :class="getRoleBadgeClass(value)">
                {{ getRoleLabel(value) }}
              </span>
            </template>
            
            <!-- Slot para data de criação -->
            <template #created_at="{ value }">
              {{ formatDate(value) }}
            </template>
          </DataTable>
        </div>
      </main>
    </div>

    <!-- Modal de adição/edição de usuário -->
    <Modal 
      :show="showModal" 
      :title="isEditing ? 'Editar Usuário' : 'Adicionar Usuário'"
      :max-width="'650px'"
      @close="closeModal"
    >
      <form @submit.prevent="saveUser" class="user-form">
        <FormInput
          v-model="newUser.name"
          label="Nome completo"
          placeholder="Digite o nome completo"
          icon="fas fa-user"
          :validator="validateName"
          required
        />

        <FormInput
          v-model="newUser.email"
          label="E-mail"
          type="email"
          placeholder="Digite o e-mail"
          icon="fas fa-envelope"
          :validator="validateEmail"
          required
        />

        <FormInput
          v-model="newUser.cpf"
          label="CPF"
          placeholder="Digite o CPF"
          icon="fas fa-id-card"
          :mask="maskCpf"
          :validator="validateCpf"
          maxlength="14"
          required
        />

        <div class="form-row">
          <FormInput
            v-model="newUser.password"
            label="Senha"
            type="password"
            placeholder="Digite a senha"
            icon="fas fa-lock"
            :validator="!isEditing ? validatePassword : null"
            :required="!isEditing"
          />

          <FormInput
            v-model="newUser.password_confirmation"
            label="Confirmação de senha"
            type="password"
            placeholder="Confirme a senha"
            icon="fas fa-check-circle"
            :validator="validateConfirmPassword"
            :required="!isEditing"
          />
        </div>

        <div class="form-group role-select">
          <label for="role">Função do usuário</label>
          <div class="select-wrapper">
            <i class="fas fa-user-shield"></i>
            <select id="role" v-model="newUser.role" required>
              <option value="" disabled>Selecione uma função</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuário</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ isEditing ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar.vue";
import DataTable from "@/components/DataTable.vue";
import FormInput from "@/components/FormInput.vue";
import Modal from "@/components/Modal.vue";
import { apiCreateUser, apiDeleteUser, apiGetUsers, apiUpdateUser } from '@/http';
import { toast } from 'vue3-toastify';
import { maskCpf } from '@/utils/masks';
import { validateCpf, validateEmail, validatePassword } from '@/utils/validators';

export default {
  components: {
    AdminSidebar,
    DataTable,
    FormInput,
    Modal
  },
  data() {
    return {
      showModal: false,
      isEditing: false,
      isLoading: true,
      isSubmitting: false,
      newUser: { 
        id: null, 
        name: "", 
        email: "", 
        role: "", 
        cpf: "", 
        password: "", 
        password_confirmation: ""
      },
      users: [],
      userId: null,
      tableColumns: [
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'email', label: 'E-mail', sortable: true },
        { key: 'cpf', label: 'CPF', sortable: true, formatter: this.formatCpf },
        { key: 'role', label: 'Função', sortable: true },
        { key: 'created_at', label: 'Data de Cadastro', sortable: true },
      ],
      filteredUsers: [],
      searchTerm: ''
    };
  },
  mounted() {
    this.fetchUsers();
    this.getUserIdFromLocalStorage();
  },
  methods: {
    // Funções de máscara e validação
    maskCpf,
    validateCpf,
    validateEmail,
    validatePassword,
    
    validateName(value) {
      if (!value || value.trim().length < 3) {
        return 'O nome deve ter pelo menos 3 caracteres';
      }
      
      if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
        return 'O nome deve conter apenas letras e espaços';
      }
      
      return null;
    },
    
    validateConfirmPassword(value) {
      if (!this.isEditing && !value) {
        return 'A confirmação de senha é obrigatória';
      }
      
      if (value !== this.newUser.password) {
        return 'As senhas não conferem';
      }
      
      return null;
    },
    
    formatCpf(cpf) {
      if (!cpf) return '-';
      
      const clean = cpf.replace(/\D/g, '');
      if (clean.length !== 11) return cpf;
      
      return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9, 11)}`;
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    },
    
    getRoleBadgeClass(role) {
      return role === 'admin'
        ? 'badge badge-primary'
        : 'badge badge-secondary';
    },
    
    getRoleLabel(role) {
      const labels = {
        admin: 'Administrador',
        user: 'Usuário'
      };
      
      return labels[role] || role;
    },
    
    // Funções de busca e filtro
    handleSearch(term) {
      this.searchTerm = term.toLowerCase();
      this.filterUsers();
    },
    
    filterUsers() {
      if (!this.searchTerm) {
        this.filteredUsers = [...this.users];
        return;
      }
      
      this.filteredUsers = this.users.filter(user => {
        return (
          user.name.toLowerCase().includes(this.searchTerm) ||
          user.email.toLowerCase().includes(this.searchTerm) ||
          user.cpf.includes(this.searchTerm)
        );
      });
    },
    
    // Funções de CRUD
    async fetchUsers() {
      this.isLoading = true;
      try {
        const data = await apiGetUsers();
        this.users = data.users;
        this.filterUsers();
      } catch (error) {
        toast.error(`Erro ao carregar usuários: ${(error.response?.data?.message || "Erro desconhecido.")}`);
      } finally {
        this.isLoading = false;
      }
    },

    openModal() {
      this.isEditing = false;
      this.newUser = { 
        id: null, 
        name: "", 
        email: "", 
        role: "", 
        password: "", 
        password_confirmation: "", 
        cpf: ""
      };
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
    },
    
    getUserIdFromLocalStorage() {
      const userId = localStorage.getItem('userId');
      this.userId = Number(userId);
    },
    
    enableActionButtons(id) {
      return id === this.userId;
    },
    
    async saveUser() {
      // Validação básica dos campos
      if (!this.newUser.name || !this.newUser.email || !this.newUser.cpf || !this.newUser.role) {
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      // Validação de senha para novos usuários
      if (!this.isEditing && (!this.newUser.password || !this.newUser.password_confirmation)) {
        toast.error('Por favor, informe a senha e a confirmação de senha.');
        return;
      }
      
      // Validação de confirmação de senha
      if (!this.isEditing && this.newUser.password !== this.newUser.password_confirmation) {
        toast.error('As senhas não conferem.');
        return;
      }
      
      const payload = {
        ...this.newUser,
        cpf: this.newUser.cpf.replace(/\D/g, '')
      };

      this.isSubmitting = true;
      try {
        if (this.isEditing) {
          const data = await apiUpdateUser(this.newUser.id, payload);
          toast.success(data.message || 'Usuário atualizado com sucesso!');
        } else {
          const data = await apiCreateUser(payload);
          toast.success(data.message || 'Usuário cadastrado com sucesso!');
        }
        await this.fetchUsers(); 
        this.closeModal();
      } catch (error) {
        toast.error(`Erro ao salvar usuário: ${(error.response?.data?.message || "Erro desconhecido.")}`);
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async deleteUser(userId) {
      if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
      
      this.isLoading = true;
      try {
        await apiDeleteUser(userId);
        this.users = this.users.filter(user => user.id !== userId);
        this.filterUsers();
        toast.success("Usuário excluído com sucesso!");
      } catch (error) {
        toast.error(`Erro ao excluir usuário: ${(error.response?.data?.message || "Erro desconhecido.")}`);
      } finally {
        this.isLoading = false;
      }
    },
    
    editUser(user) {
      this.isEditing = true;
      this.newUser = { ...user, password: '', password_confirmation: '' };
      this.showModal = true;
    },
  },
};
</script>

<style scoped>
.manage-users {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-light);
}

.content-wrapper {
  flex: 1;
  margin-left: 250px;
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.page-title i {
  margin-right: 0.5rem;
  color: var(--primary);
}

.page-description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.card {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

/* DataTable customization */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 2px;
}

.action-btn:hover {
  background-color: var(--bg-light);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-btn {
  color: var(--primary);
}

.delete-btn {
  color: var(--danger);
}

.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
}

.badge-primary {
  background-color: var(--primary-light);
  color: var(--primary-dark);
}

.badge-secondary {
  background-color: var(--secondary-light);
  color: var(--secondary-dark);
}

/* Form styling */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.role-select {
  margin-bottom: 1rem;
}

.role-select label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.select-wrapper {
  position: relative;
}

.select-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.select-wrapper select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: #fff;
  appearance: none;
  color: var(--text-dark);
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.select-wrapper select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    margin-top: 1rem;
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
