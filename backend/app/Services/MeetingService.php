<?php

namespace App\Services;

use App\Repositories\MeetingRepository;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MeetingService
{
    protected $meetingRepository;

    public function __construct(MeetingRepository $meetingRepository)
    {
        $this->meetingRepository = $meetingRepository;
    }

    public function getMeetingById($id)
    {
        return $this->meetingRepository->findMeetingById($id);
    }

    public function getAllMeetings()
    {
        return $this->meetingRepository->getAllMeetings();
    }

    public function getActiveMeetings()
    {
        return $this ->meetingRepository->getActiveMeetings();
    }

    public function getMeetingsByDate($date)
    {
        $validatedDate = Carbon::parse($date);
        return $this->meetingRepository->getMeetingsByDate($validatedDate);
    }

    public function getRoomOccupancy($date)
    {
        $date = Carbon::parse($date)->format('Y-m-d');

        $occupancyByRoom = $this->meetingRepository->getRoomOccupancyByDate($date);

        $occupancyData = [];

        foreach ($occupancyByRoom as $meeting) {
            $startTime = Carbon::parse($meeting->start_time);
            $endTime = Carbon::parse($meeting->end_time);
            $duration = $endTime->diffInHours($startTime);

            if (isset($occupancyData[$meeting->room_id])) {
                $occupancyData[$meeting->room_id]['hours'] += $duration;
                $occupancyData[$meeting->room_id]['reservations_count'] += 1;
            } else {
                $occupancyData[$meeting->room_id] = [
                    'room_id' => $meeting->room_id,
                    'hours' => $duration,
                    'reservations_count' => 1,
                ];
            }
        }

        return $occupancyData;
    }

    public function getReservationsCount($date)
    {
        return $this->meetingRepository->countReservationsByDate($date);
    }

    public function createMeeting(array $data)
    {
        $startTime = Carbon::createFromFormat('Y-m-d H:i', $data['date'] . ' ' . $data['start_time'])->setTimezone('America/Sao_Paulo');
        $endTime = Carbon::createFromFormat('Y-m-d H:i', $data['date'] . ' ' . $data['end_time'])->setTimezone('America/Sao_Paulo');

        $data['date'] = $startTime->format('Y-m-d');

        if ($this->meetingRepository->hasTimeConflict($data['room_id'], $startTime, $endTime)) {
            throw new \Exception('Conflito de horário com outra reunião.');
        }

        $room = $this->meetingRepository->findRoomById($data['room_id']);
        if (!$room) {
            throw new \Exception('Sala não encontrada.');
        }

        $data['user_id'] = Auth::id();

        return $this->meetingRepository->createMeeting($data);
    }

    public function getMeetingsByUser($userId)
    {
        return $this->meetingRepository->getMeetingsByUser($userId);
    }

    public function updateMeeting($id, array $data)
    {
        $meeting = $this->meetingRepository->findMeetingById($id);

        if (!$meeting) {
            throw new \Exception('Reunião não encontrada.');
        }

        $startTime = Carbon::createFromFormat('Y-m-d H:i', $data['date'] . ' ' . $data['start_time'])->setTimezone('America/Sao_Paulo');
        $endTime = Carbon::createFromFormat('Y-m-d H:i', $data['date'] . ' ' . $data['end_time'])->setTimezone('America/Sao_Paulo');

        if ($this->meetingRepository->hasTimeConflict($data['room_id'], $startTime, $endTime)) {
            throw new \Exception('Conflito de horário com outra reunião.');
        }

        return $this->meetingRepository->updateMeeting($meeting, $data);
    }

    public function updateMeetingStatus($id, string $status)
    {
        $meeting = $this->meetingRepository->findMeetingById($id);

        if (!$meeting) {
            throw new \Exception('Reunião não encontrada.');
        }

        return $this->meetingRepository->updateMeetingStatus($meeting, $status);
    }

    public function deleteMeeting($id)
    {
        $meeting = $this->meetingRepository->findMeetingById($id);
        return $this->meetingRepository->deleteMeeting($meeting);
    }

    /**
     * Função para obter as reservas de uma sala para um dia específico.
     */
    public function getReservationsByRoom($roomId, Carbon $date)
    {
        // Determinar o início e o final do dia para buscar as reservas
        $startOfDay = $date->startOfDay();
        $endOfDay = $date->endOfDay();

        // Buscar as reservas da sala (room_id) no intervalo do dia específico
        return $this->meetingRepository->getReservationsByRoom($roomId, $startOfDay, $endOfDay);
    }
}
