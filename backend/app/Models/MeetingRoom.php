<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingRoom extends Model
{
    use HasFactory;

    protected $table = 'meeting_rooms';

    protected $fillable = [
        'nome',
        'localizacao',
        'capacidade',
        'recursos',
        'ativo',
        'disponibilidade',
        'imagem',
        'descricao',
    ];

    protected $casts = [
        'recursos' => 'array',
        'disponibilidade' => 'array',
    ];

}
