<template>
  <main>
    <section class="register-container">
      <img src="@/assets/Logoditis.png" alt="Logo DITIS" />

      <p>Crie sua conta preenchendo os dados abaixo</p>

      <form @submit.prevent="handleRegister">
        <input
          type="text"
          placeholder="Digite seu nome"
          v-model="form.name"
          required
          aria-label="Nome"
        />

        <input
          type="email"
          placeholder="Digite seu e-mail"
          v-model="form.email"
          required
          aria-label="E-mail"
        />

        <input
          type="text"
          placeholder="Digite seu CPF"
          v-model="form.cpf"
          @input="handleCpfInput"
          maxlength="14" 
          required
          aria-label="CPF"
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          v-model="form.password"
          required
          aria-label="Senha"
        />

        <input
          type="password"
          placeholder="Confirme sua senha"
          v-model="form.password_confirmation"
          required
          aria-label="Confirmação de Senha"
        />

        <button type="submit">Registrar</button>
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
  import { apiRegister } from '@/http';
  import { formatCpf } from '@/utils/format-cpf';
  import { toast } from 'vue3-toastify';
  
  export default {
    data() {
      return {
        form: {
          name: '',
          email: '',
          cpf: '',
          password: '',
          password_confirmation: '',
        },
      };
    },
    methods: {
      async handleRegister() {
        const formToSubmit = {
          ...this.form,
          cpf: this.form.cpf.replace(/\D/g, '') 
        };
  
        try {
          await apiRegister(formToSubmit);

          toast.success("Registro realizado com sucesso!", { autoClose: 5000 });

          this.$router.push('/login'); 
        } catch (error) {
          toast.error(
            'Erro ao registrar: ' + (error.response?.data?.message || 'Erro desconhecido.'),
            { autoClose: 5000 }
          );
        }
      },

      handleCpfInput() {
        this.form.cpf = formatCpf(this.form.cpf)
      }
    },
  };
</script>
  
<style scoped>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1.25rem;
    height: 100vh;
  }

  .register-container {
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
    .register-container {
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
  }
</style>
