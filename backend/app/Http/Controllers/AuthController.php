<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function index(Request $request)
    {
    // Verifica se o usuário autenticado é um administrador
    if (auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Acesso negado. Apenas administradores podem visualizar todos os usuários.'], 403);
    }

    // Busca todos os usuários com informações básicas
    $users = User::select('id', 'name', 'email', 'cpf', 'role', 'created_at')->get();

    return response()->json(['users' => $users]);
    }   

    public function register(Request $request) 
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'cpf' => 'required|string|max:11|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        $role = $request->input('role', 'user');
    
        if (auth()->check() && auth()->user()->role === 'admin') {
            $role = $request->input('role', 'user');
        } else {
            $role = 'user';
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'cpf' => $request->cpf,
            'password' => Hash::make($request->password),
            'role' => $role,
        ]);
    
        return response()->json(['message' => 'Usuário registrado com sucesso!']);
    }

    public function addAdmin(Request $request) 
    {
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|email|unique:users',
        'cpf' => 'required|string|max:11|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    if (auth()->check() && auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Acesso negado. Somente administradores podem adicionar outros administradores.'], 403);
    }

    $admin = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'cpf' => $request->cpf,
        'password' => Hash::make($request->password),
        'role' => 'admin', 
    ]);

    return response()->json(['message' => 'Administrador registrado com sucesso!']);
    }

    public function updateAdmin(Request $request, $id) 
    {
    // Validação das regras
    $request->validate([
        'name' => 'sometimes|required|string',
        'email' => 'sometimes|required|string|email|unique:users,email,' . $id,
        'cpf' => 'sometimes|required|string|max:11|unique:users,cpf,' . $id,
        'password' => 'sometimes|required|string|min:8|confirmed|nullable',
    ]);

    // Verifica se o usuário autenticado é um administrador
    if (auth()->check() && auth()->user()->role !== 'admin') {
        return response()->json(['message' => 'Acesso negado. Somente administradores podem atualizar outros administradores.'], 403);
    }

    // Busca o administrador pelo ID
    $admin = User::findOrFail($id);

    // Atualiza os dados do administrador
    $admin->name = $request->name ?? $admin->name;
    $admin->email = $request->email ?? $admin->email;
    $admin->cpf = $request->cpf ?? $admin->cpf;

    // Se uma nova senha for fornecida, atualiza a senha
    if ($request->filled('password')) {
        $admin->password = Hash::make($request->password);
    }

    // Salva as alterações no banco de dados
    $admin->save();

    return response()->json(['message' => 'Administrador atualizado com sucesso!']);
    }   

    
    public function update(Request $request, $id) 
    {
        $user = User::findOrFail($id);
    
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users,email,' . $user->id,
            'cpf' => 'required|string|max:11|unique:users,cpf,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);
    
        if (auth()->user()->role === 'admin') {
            $request->validate(['role' => 'required|string|in:admin,user']);
            $user->role = $request->role;
        }
    
        $user->name = $request->name;
        $user->email = $request->email;
        $user->cpf = $request->cpf;
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
    
        $user->save();
    
        return response()->json(['message' => 'Usuário atualizado com sucesso!']);
    }
    

    public function delete(Request $request, $id) 
    {
    $user = User::findOrFail($id);

    $user->delete();

    return response()->json(['message' => 'Usuário deletado com sucesso!']);
    }


    public function login(Request $request) 
    {
        $request->validate([
            'cpf' => 'required|string|regex:/^\d{11}$/', 
            'password' => 'required|string',
        ]);
    
        $user = User::where('cpf', $request->cpf)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'cpf' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }
    
        $token = $user->createToken('token-name')->plainTextToken;
        return response()->json([
            'token' => $token,
            'role' => $user->role 
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout realizado com sucesso!']);
    }
}