<template>
  <div class="manage-users">
    <AdminSidebar />
    <header class="py-1">
      <h2>Gerenciar Usuários</h2>
    </header>

    <main>
      <div class="py-4">
        <div class="d-flex justify-content-between">
          <h4>Usuários Registrados</h4>
          <button class="btn btn-primary" @click="openModal">
            Adicionar Usuário
          </button>
        </div>
        <table class="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.cpf }}</td>
              <td v-if="!enableActionButtons(user.id)">
                <button class="btn btn-edit btn-secondary mx-1" @click="editUser(user)">
                  Editar
                </button>
                <button class="btn btn-danger mx-1" @click="deleteUser(user.id)">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div class="modal fade" :class="{ show: showModal, 'd-block': showModal }" tabindex="-1" role="dialog" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between">
            <h5 class="modal-title">{{ isEditing ? "Editar Usuário" : "Adicionar Usuário" }}</h5>
            <button class="close btn btn-danger" @click="closeModal">X</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="form-group m-3">
                <label for="name">Nome:</label>
                <input type="text" id="name" class="form-control" v-model="newUser.name" required />
              </div>
              <div class="form-group m-3">
                <label for="email">Email:</label>
                <input type="email" id="email" class="form-control" v-model="newUser.email" required />
              </div>
              <div class="form-group m-3">
                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" class="form-control" v-model="newUser.cpf" required />
              </div>
              <div class="form-group m-3">
                <label for="password">Senha:</label>
                <input type="password" id="password" class="form-control" v-model="newUser.password" required />
              </div>
              <div class="form-group m-3">
                <label for="confirmation_password">Confirme sua Senha:</label>
                <input type="password" id="confirmation_password" class="form-control" v-model="newUser.password_confirmation" required />
              </div>
              <div class="form-group m-3">
                <label for="role">Função:</label>
                <select id="role" class="form-control" v-model="newUser.role" required>
                  <option value="" disabled>Selecione uma função</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuário</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary m-3">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/components/AdminSidebar.vue";
import { apiCreateUser, apiDeleteUser, apiGetUsers, apiUpdateUser } from '@/http';
import { toast } from 'vue3-toastify';

export default {
  components: {
    AdminSidebar,
  },
  data() {
    return {
      showModal: false,
      isEditing: false,
      newUser: { id: null, name: "", email: "", role: "", cpf: "", password: "", password_confirmation: "",},
      users: [],
      userId: null,
    };
  },
  mounted() {
    this.fetchUsers();
    this.getUserIdFromLocalStorage();
  },
  methods: {
    async fetchUsers() {
      try {
        const data = await apiGetUsers();
        this.users = data.users;
      } catch (error) {
        toast.error(`Erro ao carregar usuários: ${(error.response?.data?.message || "Erro desconhecido.")}`);
      }
    },

    openModal() {
      this.isEditing = false;
      this.newUser = { id: null, name: "", email: "", role: "", password: "", password_confirmation: "", cpf: ""};
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newUser = { id: null, name: "", email: "", role: "" };
    },
    getUserIdFromLocalStorage() {
      const userId = localStorage.getItem('userId');
      this.userId = Number(userId)
    },
    enableActionButtons(id) {
      return id === this.userId;
    },
    async saveUser() {
      const payload = {
        ...this.newUser,
        cpf: this.newUser.cpf.replace(/\D/g, '')
      }

      try {
        if (this.isEditing) {
          const data = await apiUpdateUser(this.newUser.id, payload);
          toast.success(data.message);
        } else {
          const data = await apiCreateUser(payload);
          toast.success(data.message);
        }
        this.fetchUsers(); 
        this.closeModal();
      } catch (error) {
        toast.error(`Erro ao salvar usuário: ${(error.response?.data?.message || "Erro desconhecido.")}`);
      }
    },
    async deleteUser(userId) {
      if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
      try {
        await apiDeleteUser(userId);
        this.users = this.users.filter(user => user.id !== userId);
        toast.success("Usuário excluído com sucesso!");
      } catch (error) {
        toast.error(`Erro ao excluir usuário: ${(error.response?.data?.message || "Erro desconhecido.")}`);
      }
    },
    editUser(user) {
      this.isEditing = true;;;
      this.newUser = { ...user };
      this.showModal = true;
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.manage-users {
  padding: 1.5rem;
  margin-left: 250px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.users-table th,
.users-table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.users-table th {
  background-color: #f3f4f6;
}

.modal.fade.show {
  opacity: 1;
  transition: opacity 0.3s ease;
}
.modal.fade {
  opacity: 0;
}

</style>
