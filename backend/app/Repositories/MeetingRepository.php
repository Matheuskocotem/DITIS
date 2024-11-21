<?php

namespace App\Repositories;

use App\Models\Meeting;
use Carbon\Carbon;

class MeetingRepository
{
    public function getAllMeetings()
    {
        return Meeting::with('user', 'room')->get();
    }

    public function getMeetingsByDate(Carbon $date)
    {
        return Meeting::whereDate('date', $date->format('Y-m-d'))->get();
    }

    public function getRoomOccupancyByDate($date)
    {
        return Meeting::whereDate('date', $date)
            ->where('status', 'confirmed')
            ->get();
    }

    public function countReservationsByDate($date)
    {
        return Meeting::whereDate('date', $date)
            ->where('status', 'confirmed')
            ->count();
    }

    public function createMeeting(array $data)
    {
        return Meeting::create($data);
    }

    public function findRoomById($roomId)
    {
        return \App\Models\MeetingRoom::findOrFail($roomId);
    }

    public function findMeetingById($id)
    {
        return Meeting::findOrFail($id);
    }

    public function updateMeeting(Meeting $meeting, array $data)
    {
        $meeting->update($data);
        return $meeting;
    }

    public function deleteMeeting(Meeting $meeting)
    {
        return $meeting->delete();
    }

    public function getMeetingsByUser($userId)
    {
        return Meeting::with('user', 'room')->where('user_id', $userId)->get();
    }

    public function hasTimeConflict($roomId, $startTime, $endTime)
    {
        \Log::info("Verificando conflito para Sala ID: $roomId, Início: $startTime, Fim: $endTime");

        $conflict = Meeting::where('room_id', $roomId)
            ->where('status', 'confirmed')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($query) use ($startTime, $endTime) {
                    $query->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                });
            })
            ->exists();

        \Log::info("Conflito encontrado: " . ($conflict ? 'Sim' : 'Não'));

        return $conflict;
    }


    public function updateMeetingStatus(Meeting $meeting, string $status)
    {
        if (!in_array($status, ['confirmed', 'canceled'])) {
            throw new \Exception('Status inválido.');
        }

        $meeting->status = $status;
        $meeting->save();

        return $meeting;
    }
}
