<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MeetingRoomController;
use App\Http\Controllers\MeetingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'reset']);

// Rotas públicas para acesso frontend sem autenticação
Route::get('/meeting-rooms', [MeetingRoomController::class, 'index']);
Route::get('/users/index', [AuthController::class, 'index']);

// Rotas para opções de select
Route::get('/selects/users', [\App\Http\Controllers\SelectOptionsController::class, 'getUsers']);
Route::get('/selects/rooms', [\App\Http\Controllers\SelectOptionsController::class, 'getRooms']);
Route::get('/selects/meeting-statuses', [\App\Http\Controllers\SelectOptionsController::class, 'getMeetingStatuses']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/update/{id}', [AuthController::class, 'update']);
    Route::delete('/delete/{id}', [AuthController::class, 'delete']);

    Route::prefix('meeting-rooms')->group(function () {
        Route::get('/', [MeetingRoomController::class, 'index']);
        Route::get('/{id}', [MeetingRoomController::class, 'show']);
        Route::middleware(['role:admin'])->group(function () {
            Route::post('/', [MeetingRoomController::class, 'store']);
            Route::get('/{roomId}/occupancies/day/{date}', [MeetingRoomController::class, 'getOccupiedHours']);
            Route::put('/{id}', [MeetingRoomController::class, 'update']);
            Route::delete('/{id}', [MeetingRoomController::class, 'destroy']);
            Route::get('/occupancies', [MeetingRoomController::class, 'getOccupancyData']);
        });
    });

    Route::prefix('meetings')->group(function () {
        Route::get('/day/{date}', [MeetingController::class, 'getMeetingsByDay']);
        Route::get('/', [MeetingController::class, 'index']);
        Route::get('/my-meetings', [MeetingController::class, 'getMyMeetings']);
        Route::post('/', [MeetingController::class, 'store']);
        Route::get('/{id}', [MeetingController::class, 'show']);
        Route::put('/{id}', [MeetingController::class, 'update']);
        Route::delete('/{id}', [MeetingController::class, 'destroy']);
        Route::put('/{id}/status', [MeetingController::class, 'updateStatus']);
        Route::get('/room-occupaprecncy/{date}', [MeetingController::class, 'getRoomOccupancy']);
        Route::get('/reservations-by-day/{id}', [MeetingController::class, 'getReservationsByDay']);
    });

    Route::middleware(['role:admin'])->prefix('users')->group(function () {
        Route::get('/index', [AuthController::class, 'index']);
        Route::post('/add-admin', [AuthController::class, 'addAdmin']);
        Route::put('/updateAdmin/{id}', [AuthController::class, 'updateAdmin']);
        Route::get('/summary-data', [AuthController::class, 'getSummaryData']);
    });
});
