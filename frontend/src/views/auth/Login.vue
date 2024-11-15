<template>
  <main>
    <section class="login-container">
      <img src="@/assets/Logoditis.png" alt="Logo DITIS" />

      <p class="title">Entre com seu CPF e senha</p>

      <form @submit.prevent="handleLogin">
        <input
          type="text"
          placeholder="Digite seu CPF"
          v-model="cpf"
          @input="handleCpfInput"
          maxlength="14"
          required
          aria-label="CPF"
        />
        
        <input
          type="password"
          placeholder="Digite sua senha"
          v-model="password"
          required
          aria-label="Senha"
        />
        
        <a href="forgot-password" class="forgot-password">Esqueceu sua senha?</a>
        
        <button type="submit">Entrar</button>
      </form>
      
      <p class="register">
        Não tem uma conta?
        <a href="/register">Registre-se</a>
      </p>
    </section>

    <p class="copyright">© 2024 by Nexgen Arch</p>
  </main>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
import { formatCpf } from '@/utils/format-cpf';

export default {
  data() {
    return {
      cpf: '',
      password: '',
    };
  },

  methods: {
    ...mapActions('auth', ['authenticateUser']),
    async handleLogin() {
      try {
        const role = await this.authenticateUser({
          cpf: this.cpf,
          password: this.password,
        });
        
        const mapRoleScopes = {
          admin: 'admindash',
          user: 'VizualiazarReunioes'
        }
        
        toast.success("Login realizado com sucesso!", { autoClose: 5000 });

        if (role) {
          this.$router.push({ name: mapRoleScopes[role] })
        }
      } catch (error) {
        toast.error("Falha no login. Verifique os dados e tente novamente.", { autoClose: 5000 });
      }
    },

    handleCpfInput() {
      this.cpf = formatCpf(this.cpf)
    }
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

.login-container {
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
  
  .forgot-password {
    align-self: flex-start;
    font-size: 0.75rem;
    color: var(--gray-400);
    text-decoration: none;
  
    &:hover {
      color: var(--green-500);
    }
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
    
    &:hover {
      background-color: var(--green-600);
    }
  }
}

.register {
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
  .login-container {
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
