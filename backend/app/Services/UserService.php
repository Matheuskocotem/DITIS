<?php

namespace App\Services;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Repositories\UserRepository;
use Illuminate\Validation\ValidationException;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Obter todos os usuários
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllUsers()
    {
        return $this->userRepository->getAllUsers();
    }

    /**
     * Verificar se o usuário atual é admin
     * 
     * @return bool
     */
    public function isCurrentUserAdmin()
    {
        return Auth::check() && Auth::user()->role === 'admin';
    }

    /**
     * Registrar um novo usuário
     * 
     * @param array $data
     * @return \App\Models\User
     */
    public function registerUser($data)
    {
        // Garantir que a senha está criptografada
        $data['password'] = Hash::make($data['password']);
        
        // Definir função padrão do usuário se não for especificada
        if (!isset($data['role'])) {
            $data['role'] = 'user';
        }
        
        return $this->userRepository->createUser($data);
    }

    /**
     * Adicionar um administrador
     * 
     * @param array $data
     * @return \App\Models\User
     * @throws \Exception
     */
    public function addAdmin($data)
    {
        if (!$this->isCurrentUserAdmin()) {
            throw new \Exception('Você não tem permissão para adicionar um administrador.');
        }

        // Verificar se a role foi especificada e é válida
        if (!isset($data['role']) || !in_array($data['role'], ['admin', 'user'])) {
            throw new \Exception('Função (role) inválida ou não especificada.');
        }

        return $this->registerUser($data);
    }

    /**
     * Atualizar um administrador
     * 
     * @param int $id
     * @param array $data
     * @return \App\Models\User
     * @throws \Exception
     */
    public function updateAdmin($id, array $data)
    {
        $user = $this->userRepository->findUserById($id);

        if (!$user) {
            throw new \Exception('Usuário não encontrado.');
        }

        // Verificação de permissão para alterar role
        if (isset($data['role']) && $data['role'] !== $user->role) {
            if (!$this->isCurrentUserAdmin()) {
                throw new \Exception('Você não tem permissão para alterar a função de um usuário.');
            }
            
            if (!in_array($data['role'], ['admin', 'user'])) {
                throw new \Exception('Função (role) inválida.');
            }
        }

        // Criptografar senha se estiver sendo atualizada
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            // Se não houver senha ou estiver vazia, remova do array de dados
            unset($data['password']);
        }

        return $this->userRepository->updateUser($user, $data);
    }

    /**
     * Atualizar um usuário
     * 
     * @param int $id
     * @param array $data
     * @param bool $isAdmin
     * @return \App\Models\User
     * @throws \Exception
     */
    public function updateUser($id, $data, $isAdmin = false)
    {
        $user = $this->userRepository->findUserById($id);

        if (!$user) {
            throw new \Exception('Usuário não encontrado.');
        }

        // Verificar se o usuário tem permissão para atualizar
        if (!$isAdmin && Auth::id() !== $user->id) {
            throw new \Exception('Você não tem permissão para atualizar este usuário.');
        }

        // Atualizar role apenas se o usuário for admin
        if ($isAdmin && isset($data['role'])) {
            if (!in_array($data['role'], ['admin', 'user'])) {
                throw new \Exception('Função (role) inválida.');
            }
        } elseif (isset($data['role'])) {
            // Não permitir que usuários comuns alterem sua própria role
            unset($data['role']); 
        }

        // Criptografar senha se estiver sendo atualizada
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            // Se não houver senha ou estiver vazia, remova do array de dados
            unset($data['password']);
        }

        return $this->userRepository->updateUser($user, $data);
    }

    /**
     * Excluir um usuário
     * 
     * @param int $id
     * @return bool
     * @throws \Exception
     */
    public function deleteUser($id)
    {
        $user = $this->userRepository->findUserById($id);
        
        if (!$user) {
            throw new \Exception('Usuário não encontrado.');
        }

        // Verificar se o usuário atual é admin ou está excluindo a si mesmo
        if (!$this->isCurrentUserAdmin() && Auth::id() !== $user->id) {
            throw new \Exception('Você não tem permissão para excluir este usuário.');
        }
        
        return $this->userRepository->deleteUser($user);
    }

    /**
     * Realizar login do usuário
     * 
     * @param string $cpf
     * @param string $password
     * @return array
     * @throws ValidationException
     */
    public function loginUser($cpf, $password)
    {
        $user = $this->userRepository->getUserByCpf($cpf);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'cpf' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        // Gerar token de acesso
        $token = $user->createToken('auth-token')->plainTextToken;
        
        return [
            'id' => $user->id,
            'name' => $user->name,
            'token' => $token,
            'role' => $user->role
        ];
    }

    /**
     * Realizar logout do usuário
     * 
     * @param \App\Models\User $user
     * @return array
     */
    public function logoutUser($user)
    {
        $user->currentAccessToken()->delete();
        return ['message' => 'Logout realizado com sucesso!'];
    }

    /**
     * Obter dados de resumo do dashboard
     * 
     * @return array
     */
    public function getSummaryData()
    {
        return $this->userRepository->getSummaryData();
    }

    /**
     * Enviar link de redefinição de senha
     * 
     * @param string $email
     * @return string
     */
    public function sendResetLink($email)
    {
        return Password::sendResetLink(['email' => $email]);
    }

    /**
     * Redefinir senha do usuário
     * 
     * @param string $email
     * @param string $token
     * @param string $password
     * @return bool
     * @throws \Exception
     */
    public function resetPassword($email, $token, $password)
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            throw new \Exception('Usuário não encontrado.');
        }

        // Verificar o token
        $status = Password::reset(
            ['email' => $email, 'token' => $token, 'password' => $password],
            function ($user, $password) {
                $user->password = Hash::make($password);
                $this->userRepository->saveUser($user);
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new \Exception('Não foi possível redefinir a senha. Token inválido ou expirado.');
        }

        return true;
    }
}
