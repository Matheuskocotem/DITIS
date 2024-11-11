<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
// Migration
public function up(): void
{
    Schema::create('meetings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('room_id')->constrained('meeting_rooms')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->date('date');
        $table->time('start_time');
        $table->time('end_time');
        $table->enum('status', ['confirmed', 'canceled'])->default('confirmed');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
