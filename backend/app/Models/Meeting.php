<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'user_id',
        'title',
        'description',
        'date',
        'status',
        'start_time',
        'end_time',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function room()
    {
        return $this->belongsTo(MeetingRoom::class);
    }


    protected static function boot()
    {
        parent::boot();
    
        static::saving(function ($meeting) {
            if ($meeting->status === 'confirmed' && $meeting->hasTimeConflict()) {
                throw new \Exception('Conflito de horário com outra reunião confirmada.');
            }
        });
    }

    public function hasTimeConflict()
    {
        return self::where('room_id', $this->room_id)
            ->where('date', $this->date)
            ->where('status', 'confirmed')
            ->where(function ($query) {
                $query->where(function ($query) {
                    $query->where('start_time', '<', $this->end_time)
                        ->where('end_time', '>', $this->start_time);
                });
            })
            ->where('id', '!=', $this->id) 
            ->exists();
    }
}
