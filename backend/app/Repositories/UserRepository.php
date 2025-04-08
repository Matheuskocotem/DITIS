<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Meeting;
use App\Models\MeetingRoom;

class UserRepository
{
    /**
     * Obter todos os usuários com colunas específicas
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllUsers()
    {
        return User::select('id', 'name', 'email', 'cpf', 'role', 'created_at')->get();
    }

    /**
     * Encontrar usuário pelo ID
     *
     * @param int $id
     * @return \App\Models\User|null
     */
    public function findUserById($id)
    {
        return User::where('id', $id)->first();
    }

    /**
     * Criar um novo usuário
     *
     * @param array $data
     * @return User
     */
    public function createUser($data)
    {
        return User::create($data);
    }

    /**
     * Atualizar um usuário
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function updateUser(User $user, $data)
    {
        $user->update($data);
        return $user->fresh();
    }

    /**
     * Excluir um usuário
     *
     * @param User $user
     * @return bool
     */
    public function deleteUser(User $user)
    {
        return $user->delete();
    }

    /**
     * Encontrar usuário pelo CPF
     *
     * @param string $cpf
     * @return User|null
     */
    public function getUserByCpf($cpf)
    {
        return User::where('cpf', $cpf)->first();
    }

    /**
     * Contar total de usuários
     *
     * @return int
     */
    public function countUsers()
    {
        return User::count();
    }

    /**
     * Encontrar usuário pelo email
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }
    
    /**
     * Salvar usuário após modificações
     *
     * @param User $user
     * @return User
     */
    public function saveUser(User $user)
    {
        $user->save();
        return $user;
    }
    
    /**
     * Obter dados de resumo (contagens)
     *
     * @return array
     */
    public function getSummaryData()
    {
        return [
            'totalReservas' => Meeting::count(),
            'salasDisponiveis' => MeetingRoom::count(),
            'totalUsuarios' => $this->countUsers(),
        ];
    }
}
