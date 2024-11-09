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
          @input="formatCpf"
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
        <a href="/register" class="link">Registre-se</a>
      </p>
    </section>

    <p class="copyright">© 2024 by Nexgen Arch</p>
  </main>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      cpf: '',
      password: '',
    };
  },

  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        const response = await this.$store.dispatch('login', {
          cpf: this.cpf,
          password: this.password,
        });

        console.log("Dados do usuário:", response);

        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        toast.success("Login realizado com sucesso!", { autoClose: 5000 });

        if (response.role) {
          if (response.role === 'admin') {
            this.$router.push({ name: 'admindash' });
          } else {
            this.$router.push({ name: 'VizualiazarReunioes' });
          }
        } else {
          console.error("Papel do usuário não encontrado");
          toast.error("Papel do usuário não encontrado. Tente novamente.", { autoClose: 5000 });
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error.response ? error.response.data : error.message);
        toast.error("Login falhou. Verifique seu CPF e senha.", { autoClose: 5000 });
      }
    },

    formatCpf() {
      let cpf = this.cpf.replace(/\D/g, '');

      if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }

      this.cpf = cpf;
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

  .forgot-password, #linkForm .link {
    font-size: 11px;
  }
}
</style>
