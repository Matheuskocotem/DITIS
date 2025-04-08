<template>
  <main>
    <section class="register-container">
      <img src="@/assets/Logoditis.png" alt="Logo DITIS" />

      <h1 class="title">Crie sua conta</h1>
      <p class="subtitle">Preencha os dados abaixo para se registrar</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <FormInput
          v-model="form.name"
          label="Nome completo"
          placeholder="Digite seu nome completo"
          icon="fas fa-user"
          :validator="validateName"
          required
        />

        <FormInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="Digite seu e-mail"
          icon="fas fa-envelope"
          :validator="validateEmail"
          required
        />

        <FormInput
          v-model="form.cpf"
          label="CPF"
          placeholder="Digite seu CPF"
          icon="fas fa-id-card"
          :mask="maskCpf"
          :validator="validateCpf"
          maxlength="14"
          required
        />

        <div class="form-row">
          <FormInput
            v-model="form.password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            icon="fas fa-lock"
            :validator="validatePassword"
            required
          />

          <FormInput
            v-model="form.password_confirmation"
            label="Confirmação de senha"
            type="password"
            placeholder="Confirme sua senha"
            icon="fas fa-check-circle"
            :validator="validateConfirmPassword"
            required
          />
        </div>

        <button type="submit" :disabled="isLoading || !isFormValid" class="register-button">
          <span v-if="isLoading">
            <i class="fas fa-circle-notch fa-spin"></i> Processando...
          </span>
          <span v-else>
            <i class="fas fa-user-plus"></i> Criar conta
          </span>
        </button>
      </form>

      <p class="login">
        Já tem uma conta? 
        <router-link to="/login">Faça login</router-link>
      </p>
    </section>

    <p class="copyright">© 2024 by Nexgen Arch</p>
  </main>
</template>
  
<script>
import { apiRegister } from '@/http';
import { toast } from 'vue3-toastify';
import FormInput from '@/components/FormInput.vue';
import { maskCpf, unmask } from '@/utils/masks';
import { validateCpf, validateEmail, validatePassword, validatePasswordConfirmation, createRequiredValidator } from '@/utils/validators';
  
export default {
  components: {
    FormInput
  },
  
  data() {
    return {
      form: {
        name: '',
        email: '',
        cpf: '',
        password: '',
        password_confirmation: '',
      },
      isLoading: false,
      errors: {}
    };
  },
  
  computed: {
    isFormValid() {
      return (
        this.form.name && 
        this.form.email && 
        this.form.cpf && 
        this.form.cpf.length >= 14 &&
        this.form.password && 
        this.form.password_confirmation &&
        this.form.password === this.form.password_confirmation
      );
    }
  },
  
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.errors = {};
      
      // Realizar validações antes de enviar
      if (!this.validateForm()) {
        this.isLoading = false;
        return;
      }
      
      // Preparar dados para envio (remover máscara do CPF)
      const formToSubmit = {
        ...this.form,
        cpf: unmask(this.form.cpf)
      };
  
      try {
        await apiRegister(formToSubmit);

        toast.success("Registro realizado com sucesso!", { 
          autoClose: 3000,
          theme: 'colored'
        });

        // Redirecionar para a página de login
        setTimeout(() => {
          this.$router.push('/login'); 
        }, 1500);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro desconhecido ao registrar.';
        toast.error(errorMessage, { 
          autoClose: 5000, 
          theme: 'colored' 
        });
        
        // Tratar erros específicos do backend
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          Object.keys(backendErrors).forEach(field => {
            this.errors[field] = backendErrors[field][0];
          });
        }
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      let isValid = true;
      
      // Validar nome
      const nameError = this.validateName(this.form.name);
      if (nameError) {
        this.errors.name = nameError;
        isValid = false;
      }
      
      // Validar email
      const emailError = validateEmail(this.form.email);
      if (emailError) {
        this.errors.email = emailError;
        isValid = false;
      }
      
      // Validar CPF
      const cpfError = validateCpf(this.form.cpf);
      if (cpfError) {
        this.errors.cpf = cpfError;
        isValid = false;
      }
      
      // Validar senha
      const passwordError = validatePassword(this.form.password);
      if (passwordError) {
        this.errors.password = passwordError;
        isValid = false;
      }
      
      // Validar confirmação de senha
      const confirmError = this.validateConfirmPassword(this.form.password_confirmation);
      if (confirmError) {
        this.errors.password_confirmation = confirmError;
        isValid = false;
      }
      
      return isValid;
    },
    
    validateName(value) {
      const validator = createRequiredValidator('Nome completo');
      const error = validator(value);
      if (error) return error;
      
      if (value.length < 3) {
        return 'Nome deve ter pelo menos 3 caracteres';
      }
      
      return null;
    },
    
    validateConfirmPassword(value) {
      if (!value) return 'Confirmação de senha é obrigatória';
      if (value !== this.form.password) return 'As senhas não conferem';
      return null;
    },
    
    // Exporta funções para uso no template
    maskCpf,
    validateCpf,
    validateEmail,
    validatePassword
  }
};
</script>
  
<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: var(--gray-50);
  background-image: linear-gradient(135deg, rgba(240, 249, 255, 0.6) 0%, rgba(214, 252, 233, 0.6) 100%);
}

.register-container {
  width: 38rem;
  padding: 2.5rem;
  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
    width: 50%;
    max-width: 200px;
    margin-bottom: 0.5rem;
  }

  .title {
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--gray-800);
    margin: 0;
  }
  
  .subtitle {
    font-size: 1rem;
    color: var(--gray-600);
    margin-top: 0;
    margin-bottom: 1rem;
  }
}

.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  .form-row {
    display: flex;
    width: 100%;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .register-button {
    width: 100%;
    margin-top: 1rem;
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

.login {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-top: 1rem;

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

@media (max-width: 768px) {
  .register-container {
    width: 90%;
    max-width: 38rem;
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  main {
    background-image: none;
    background-color: var(--white);
    padding: 0;
  }
  
  .register-container {
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
      width: 45%;
      max-width: 160px;
    }
    
    .title {
      font-size: 1.25rem;
    }
    
    .subtitle {
      font-size: 0.9rem;
    }
  }

  .register-form {
    gap: 1.25rem;
  }
  
  .copyright {
    display: none;
  }
}
</style>
