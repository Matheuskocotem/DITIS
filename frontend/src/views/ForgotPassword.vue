<template>
  <main>
    <section class="reset-password-container">
      <img src="@/assets/Logoditis.png" alt="Logo DITIS" />

      <p class="title">Redefina sua senha preenchendo o e-mail abaixo</p>

      <form @submit.prevent="handleResetPassword">
        <input
          type="email"
          placeholder="Digite seu e-mail"
          v-model="email"
          required
          aria-label="E-mail"
        />
  
        <button type="submit">Enviar E-mail de Redefinição</button>
      </form>

      <p class="login">
        Já tem uma conta?
        <a href="/login">Faça login.</a>
      </p>
    </section>
  
    <p class="copyright">© 2024 by Nexgen Arch</p>
  </main>
</template>
    
<script>
  import { apiForgotPassword } from '@/http';

  export default {
    data() {
      return {
        email: '',
      };
    },
    methods: {
      async handleResetPassword() {
        try {
          await apiForgotPassword({ email: this.email });
          
          alert('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
          this.$router.push('/login');
        } catch (error) {
          alert('Erro ao enviar o e-mail: ' + (error.response?.data?.message || 'Erro desconhecido.'));
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
      text-align: center;
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
  }
  </style>