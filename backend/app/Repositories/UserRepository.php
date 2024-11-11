<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function getAllUsers()
    {
        return User::select('id', 'name', 'email', 'cpf', 'role', 'created_at')->get();
    }

    public function findUserById($id)
    {
        return User::findOrFail($id);
    }

    public function createUser($data)
    {
        return User::create($data);
    }

    public function updateUser(User $user, $data)
    {
        $user->update($data);
        return $user;
    }

    public function deleteUser(User $user)
    {
        return $user->delete();
    }

    public function getUserByCpf($cpf)
    {
        return User::where('cpf', $cpf)->first();
    }

    public function countUsers()
    {
        return User::count();
    }

    public function findByEmail($email)
    {
        return User::where('email', $email)->first();
    }

    public function updatePassword(User $user, $password)
    {
        $user->password = bcrypt($password); 
        $user->save();
    }
}
