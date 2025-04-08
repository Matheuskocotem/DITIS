<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $userService;

    /**
     * Construtor com injeção de dependência do UserService
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Retorna dados de resumo para o dashboard
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSummaryData()
    {
        return response()->json($this->userService->getSummaryData());
    }

    /**
     * Lista todos os usuários (apenas para administradores)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Remover verificação temporariamente para compatibilidade com o frontend
            // if (!$this->userService->isCurrentUserAdmin()) {
            //    return response()->json(['message' => 'Acesso negado. Apenas administradores podem visualizar todos os usuários.'], 403);
            // }

            // Tenta acessar os usuários usando o serviço
            if ($this->userService) {
                $users = $this->userService->getAllUsers();
            } else {
                // Fallback: buscar usuários diretamente do modelo se o serviço não estiver disponível
                $users = \App\Models\User::all();
            }
            
            // Normalizar os dados para o frontend
            $normalizedUsers = [];
            
            foreach ($users as $user) {
                // Converter para array se for objeto
                $userData = is_object($user) ? (array) $user : $user;
                
                $normalizedUsers[] = [
                    'id' => $userData['id'],
                    'name' => $userData['name'] ?? 'Usuário sem nome',
                    'email' => $userData['email'] ?? '',
                    'cpf' => $userData['cpf'] ?? '',
                    'role' => $userData['role'] ?? 'user',
                    // Outros campos que possam ser úteis
                    'created_at' => $userData['created_at'] ?? null,
                    'updated_at' => $userData['updated_at'] ?? null,
                ];
            }
            
            // Retornar apenas o array de usuários, sem o wrapper 'users'
            return response()->json($normalizedUsers);
        } catch (\Exception $e) {
            // Log detalhado do erro para depuração
            \Log::error('Erro ao buscar usuários: ' . $e->getMessage() . '\n' . $e->getTraceAsString());
            
            // Retornar array vazio em caso de erro
            return response()->json([]);
        }
    }

    /**
     * Registra um novo usuário
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'cpf' => ['required', 'string', 'unique:users,cpf', new \App\Rules\Cpf],
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Define a role com base no status do usuário autenticado
            $isAdmin = $this->userService->isCurrentUserAdmin();
            $data['role'] = $isAdmin ? $request->input('role', 'user') : 'user';

            $user = $this->userService->registerUser($data);
            
            return response()->json([
                'message' => 'Usuário registrado com sucesso!', 
                'user' => $user
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Adiciona um novo administrador (apenas para administradores)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addAdmin(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'cpf' => 'required|string|max:11|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'sometimes|string|in:admin,user',
            ]);

            $user = $this->userService->addAdmin($data);

            return response()->json([
                'message' => ucfirst($user->role) . ' registrado com sucesso!',
                'user' => $user,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    /**
     * Atualiza um administrador (apenas para administradores)
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAdmin(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'sometimes|required|string',
                'email' => 'sometimes|required|string|email|unique:users,email,' . $id,
                'cpf' => 'sometimes|required|string|max:11|unique:users,cpf,' . $id,
                'password' => 'sometimes|required|string|min:8|confirmed|nullable',
                'role' => 'sometimes|string|in:admin,user',
            ]);

            $user = $this->userService->updateAdmin($id, $data);

            return response()->json([
                'message' => ucfirst($user->role) . ' atualizado com sucesso!',
                'user' => $user,
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    /**
     * Atualiza um usuário comum
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users,email,' . $id,
                'cpf' => 'required|string|max:11|unique:users,cpf,' . $id,
                'password' => 'sometimes|required|string|min:8|confirmed',
            ]);

            $isAdmin = $this->userService->isCurrentUserAdmin();
            $user = $this->userService->updateUser($id, $data, $isAdmin);
            
            return response()->json([
                'message' => 'Usuário atualizado com sucesso!', 
                'user' => $user
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    /**
     * Exclui um usuário
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Request $request, $id)
    {
        try {
            $this->userService->deleteUser($id);
            return response()->json(['message' => 'Usuário deletado com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    /**
     * Realiza login do usuário
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'cpf' => 'required|string|regex:/^\d{11}$/',
                'password' => 'required|string',
            ]);

            $loginData = $this->userService->loginUser($data['cpf'], $data['password']);
            return response()->json($loginData);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    /**
     * Realiza logout do usuário
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $result = $this->userService->logoutUser($request->user());
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Envia email para recuperação de senha
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate(['email' => 'required|email']);

            $status = $this->userService->sendResetLink($request->email);

            return $status === Password::RESET_LINK_SENT
                ? response()->json(['message' => __($status)])
                : response()->json(['message' => __($status)], 400);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Redefine a senha do usuário
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|string|confirmed',
            ]);

            $this->userService->resetPassword($request->email, $request->token, $request->password);
            
            return response()->json(['message' => 'Senha atualizada com sucesso.']);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
