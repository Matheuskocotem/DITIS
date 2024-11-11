<?php

namespace App\Repositories;

use App\Models\MeetingRoom;
use App\Models\Meeting;
use Carbon\Carbon;

class MeetingRoomRepository
{
    public function getAllRooms()
    {
        return MeetingRoom::all();
    }

    public function getRoomById($id)
    {
        return MeetingRoom::findOrFail($id);
    }

    public function createRoom(array $data)
    {
        return MeetingRoom::create($data);
    }

    public function updateRoom(MeetingRoom $room, array $data)
    {
        $room->update($data);
        return $room;
    }

    public function deleteRoom(MeetingRoom $room)
    {
        $room->delete();
    }

    public function getOccupiedHours($roomId, Carbon $date)
    {
        return Meeting::where('meeting_room_id', $roomId)
                      ->whereDate('meeting_date', $date)
                      ->get(['start_time', 'end_time']);
    }

    public function getOccupancyData()
    {
        $meetingRooms = $this->getAllRooms();
        $occupancies = [];

        foreach ($meetingRooms as $room) {
            $totalHours = Meeting::where('meeting_room_id', $room->id)
                ->sum('duration'); 
            $occupancies[] = [
                'room' => $room->name,
                'hours' => $totalHours,
            ];
        }

        return $occupancies;
    }
}
