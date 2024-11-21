<?php

namespace App\Http\Controllers;

use App\Services\MeetingService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Meeting;


class MeetingController extends Controller
{
    protected $meetingService;

    public function __construct(MeetingService $meetingService)
    {
        $this->meetingService = $meetingService;
    }



    public function index()
    {
        return response()->json($this->meetingService->getAllMeetings());
    }

    public function getRoomOccupancy($date)
    {
        $occupancyData = $this->meetingService->getRoomOccupancy($date);

        return response()->json([
            'date' => $date,
            'occupancy_by_room' => array_values($occupancyData),
        ]);
    }

    public function getMyMeetings(Request $request)
    {
        $user = $request->user();
        return response()->json($this->meetingService->getMeetingsByUser($user->id));
    }

    public function getReservationsByDay($date)
    {
        $reservationsCount = $this->meetingService->getReservationsCount($date);

        return response()->json([
            'date' => $date,
            'reservations_count' => $reservationsCount,
        ]);
    }

    public function getMeetingsByDay($date)
    {
        return response()->json($this->meetingService->getMeetingsByDate($date));
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:meeting_rooms,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        try {
            $meeting = $this->meetingService->createMeeting($request->all());
            return response()->json($meeting, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        return response()->json($this->meetingService->getMeetingById($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'room_id' => 'required|exists:meeting_rooms,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        try {
            $meeting = $this->meetingService->updateMeeting($id, $request->all());
            return response()->json($meeting);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 400);
        }
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,canceled',
        ]);

        try {
            $meeting = $this->meetingService->updateMeetingStatus($id, $request->status);

            return response()->json($meeting);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $meeting = $this->meetingService->deleteMeeting($id);
            return response()->json(['message' => 'Reunião deletada com sucesso!', 'meeting' => $meeting]);
        } catch (\Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage()], 400);
        }
    }
}
