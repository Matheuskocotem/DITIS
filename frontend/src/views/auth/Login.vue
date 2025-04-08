<template>
  <main>
    <section class="login-container">
      <img src="@/assets/Logoditis.png" alt="Logo DITIS" />

      <h1 class="title">Entre com seu CPF e senha</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <FormInput
          v-model="form.cpf"
          label="CPF"
          placeholder="Digite seu CPF"
          :mask="maskCpf"
          :validator="validateCpf"
          icon="fas fa-id-card"
          maxlength="14"
          required
        />
        
        <FormInput
          v-model="form.password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          icon="fas fa-lock"
          required
        />
        
        <router-link to="/forgot-password" class="forgot-password">
          Esqueceu sua senha?
        </router-link>
        
        <button type="submit" :disabled="isLoading" class="login-button">
          <span v-if="isLoading">
            <i class="fas fa-circle-notch fa-spin"></i> Entrando...
          </span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <p class="register">
        Não tem uma conta?
        <router-link to="/register">Registre-se</router-link>
      </p>
    </section>

    <p class="copyright">© 2024 by Nexgen Arch</p>
  </main>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
import FormInput from '@/components/FormInput.vue';
import { maskCpf, unmask } from '@/utils/masks';
import { validateCpf } from '@/utils/validators';

export default {
  components: {
    FormInput
  },
  
  data() {
    return {
      form: {
        cpf: '',
        password: ''
      },
      isLoading: false,
      errors: {}
    };
  },

  methods: {
    ...mapActions('auth', ['authenticateUser']),
    
    async handleLogin() {
      this.isLoading = true;
      this.errors = {};
      
      try {
        // Verificar se o formulário é válido
        if (!this.validateForm()) {
          this.isLoading = false;
          return;
        }
        
        // Preparar dados para envio (remover máscara do CPF)
        const loginData = {
          cpf: unmask(this.form.cpf),
          password: this.form.password
        };
        
        const role = await this.authenticateUser(loginData);
        
        const mapRoleScopes = {
          admin: 'dashboard',
          user: 'reunioes'
        };
        
        toast.success("Login realizado com sucesso!", { 
          autoClose: 3000,
          theme: 'colored'
        });

        // Redirecionar com base na role
        if (role) {
          const route = mapRoleScopes[role] || 'login';
          this.$router.push({ name: route });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           "Falha no login. Verifique os dados e tente novamente.";
        
        toast.error(errorMessage, { 
          autoClose: 5000,
          theme: 'colored'
        });
      } finally {
        this.isLoading = false;
      }
    },
    
    validateForm() {
      let isValid = true;
      
      // Validar CPF
      const cpfError = validateCpf(this.form.cpf);
      if (cpfError) {
        this.errors.cpf = cpfError;
        isValid = false;
        toast.error(cpfError, { autoClose: 3000 });
      }
      
      // Validar senha
      if (!this.form.password) {
        this.errors.password = "Senha é obrigatória";
        isValid = false;
        toast.error("Senha é obrigatória", { autoClose: 3000 });
      }
      
      return isValid;
    },
    
    // Exporta as funções para uso no template
    maskCpf,
    validateCpf
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.25rem;
  height: 100vh;
  background-color: var(--gray-50);
  background-image: linear-gradient(135deg, rgba(240, 249, 255, 0.6) 0%, rgba(214, 252, 233, 0.6) 100%);
}

.login-container {
  width: 28rem;
  padding: 2.5rem;
  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--green-500), var(--blue-400));
  }

  > img {
    width: 65%;
    margin-bottom: 0.5rem;
  }

  .title {
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--gray-800);
    margin: 0;
  }
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  
  .forgot-password {
    align-self: flex-end;
    font-size: 0.8rem;
    color: var(--gray-500);
    text-decoration: none;
    margin-top: -0.75rem;
    margin-bottom: 0.75rem;
    transition: all 0.2s ease;
  
    &:hover {
      color: var(--green-600);
      text-decoration: underline;
    }
  }
  
  .login-button {
    width: 100%;
    padding: 0.875rem;
    border: none;
    border-radius: 8px;
    background-color: var(--green-500);
    color: var(--white);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
      background-color: var(--green-600);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(21, 128, 61, 0.2);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
    
    &:disabled {
      background-color: var(--gray-400);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    i {
      font-size: 1rem;
    }
  }
}

.register {
  font-size: 0.9rem;
  color: var(--gray-600);

  a {
    color: var(--green-600);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    margin-left: 0.25rem;

    &:hover {
      color: var(--blue-500);
      text-decoration: underline;
    }
  }
}

.copyright {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .login-container {
    width: 90%;
    max-width: 28rem;
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  main {
    background-image: none;
    background-color: var(--white);
  }
  
  .login-container {
    width: 100%;
    height: 100%;
    padding: 2rem 1.5rem;
    box-shadow: none;
    border-radius: 0;
    justify-content: center;
    
    &:before {
      height: 3px;
    }
    
    > img {
      width: 50%;
      max-width: 180px;
    }
    
    .title {
      font-size: 1.25rem;
    }
  }

  .login-form {
    gap: 1.5rem;
  }
  
  .copyright {
    display: none;
  }
}
</style>
