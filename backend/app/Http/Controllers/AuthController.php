<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getSummaryData()
    {
        return response()->json($this->userService->getSummaryData());
    }

    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Acesso negado. Apenas administradores podem visualizar todos os usuários.'], 403);
        }

        return response()->json(['users' => $this->userService->getAllUsers()]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'cpf' => 'required|string|max:11|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $data['role'] = auth()->check() && auth()->user()->role === 'admin' ? $request->input('role', 'user') : 'user';

        return response()->json(['message' => 'Usuário registrado com sucesso!', 'user' => $this->userService->registerUser($data)]);
    }

    public function addAdmin(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'cpf' => 'required|string|max:11|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        return response()->json(['message' => 'Administrador registrado com sucesso!', 'admin' => $this->userService->addAdmin($data)]);
    }

    public function updateAdmin(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $id,
            'cpf' => 'sometimes|required|string|max:11|unique:users,cpf,' . $id,
            'password' => 'sometimes|required|string|min:8|confirmed|nullable',
        ]);

        return response()->json(['message' => 'Administrador atualizado com sucesso!', 'admin' => $this->userService->updateAdmin($id, $data)]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $id,
            'cpf' => 'required|string|max:11|unique:users,cpf,' . $id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        $isAdmin = auth()->user()->role === 'admin';
        return response()->json(['message' => 'Usuário atualizado com sucesso!', 'user' => $this->userService->updateUser($id, $data, $isAdmin)]);
    }

    public function delete(Request $request, $id)
    {
        return response()->json(['message' => 'Usuário deletado com sucesso!', 'user' => $this->userService->deleteUser($id)]);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'cpf' => 'required|string|regex:/^\d{11}$/',
            'password' => 'required|string',
        ]);

        return response()->json($this->userService->loginUser($data['cpf'], $data['password']));
    }

    public function logout(Request $request)
    {
        return response()->json($this->userService->logoutUser($request->user()));
    }



    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = $this->userService->sendResetLink($request->email);

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    // Método para redefinir a senha do usuário
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|confirmed',
        ]);

        return $this->userService->resetPassword($request->email, $request->token, $request->password);
    }
}
