<template>
  <main>
    <section class="reset-password-container">
      <img src="@/assets/Logoditis.png" alt="Logo DITIS" />

      <p>Redefina sua senha preenchendo os campos abaixo</p>

      <form @submit.prevent="handleResetPassword">
        <input
          type="password"
          placeholder="Nova senha"
          v-model="form.password"
          required
          aria-label="Nova senha"
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          v-model="form.password_confirmation"
          required
          aria-label="Confirmar nova senha"
        />

        <p
          v-if="!isPasswordEquals && !isPasswordFieldsEmpty"
          class="error-message"
        >
          As senhas não coincidem.
        </p>

        <button type="submit" :disabled="isSubmitButtonDisabled">
          {{ isSubmitting ? 'Redefinindo...' : 'Redefinir Senha' }}
        </button>
      </form>
   
      <p class="login">
        Já tem uma conta? 
        <a href="/login">Faça login</a>
      </p>
    </section>
    
    <p class="copyright">© 2024 by Nexgen Arch</p>
  </main>
</template>

<script>
import { toast } from 'vue3-toastify';
import { apiResetPassword } from '@/http';

export default {
  data() {
    return {
      form: {
        email: '',
        token: '',
        password: '',
        password_confirmation: '',
      },
      isSubmitting: false,
    };
  },

  mounted() {
    const token = this.$route.params.token;
    const email = this.$route.params.email;
    if (token && email) {
      this.form.email = email;
      this.form.password = password;
    }
  },

  computed: {
    isPasswordFieldsEmpty() {
      return (
        this.form.password.length === 0 ||
        this.form.password_confirmation.length === 0
      )
    },
    isPasswordEquals() {
      return (
        this.form.password === this.form.password_confirmation
      )
    },
    isSubmitButtonDisabled() {
      return (
        this.isPasswordFieldsEmpty ||
        this.isSubmitting ||
        !this.isPasswordEquals
      )
    }
  },

  methods: {
    async handleResetPassword() {
      try {
        this.isSubmitting = true;
        
        await apiResetPassword({ ...this.form })

        toast.success('Senha redefinida com sucesso.', { autoClose: 5000 });
        this.$router.push('/login');
      } catch (error) {
        toast.error('Ocorreu um erro ao redefinir a senha.');
      } finally {
        this.isSubmitting = false;
      }
    },
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
}

.reset-password-container {
  width: 25rem;
  padding: 1.875rem;
  background-color: var(--white);
  border-radius: 15px;
  box-shadow: var(--shadow-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  > img {
    width: 70%;
  }

  .title {
    font-weight: 500;
  }
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  input {
    width: 100%;
    padding: 0.675rem;
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    font-size: 0.875rem;
    box-shadow: var(--shadow-secondary);
    
    &:focus {
      border-color: var(--green-500);
      outline: none;
    }
  }
  
  .error-message {
    color: var(--red-400);
    font-size: 0.75rem;
  }
  
  button[type="submit"] {
    width: 100%;
    padding: 0.675rem;
    border: none;
    border-radius: 8px;
    background-color: var(--green-500);
    color: var(--white);
    font-size: 0.875rem;
    transition: background-color 0.3s ease;
    
    &:not(:disabled):hover {
      background-color: var(--green-600);
    }

    &:disabled {
      opacity: 70%;
      cursor: not-allowed;
    }
  }
}

.login {
  font-size: 0.875rem;

  a {
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--blue-400);
    }
  }
}

.copyright {
  font-size: 0.625rem;
  color: var(--gray-500);
}

@media (max-width: 480px) {
  .reset-password-container {
    width: 100%;
    padding: 1.5rem;
    box-shadow: none;
    border-radius: 0;
    
    > img {
      width: 140px;
    }
  }

  form {
    gap: 1.5rem;
  }

  .forgot-password {
    font-size: 11px;
  }
}
</style>
