<template>
  <div class="min-h-screen bg-gray-100 flex">
    <div class="sidebar">
      <SideBar />
    </div>

    <div class="main-content">
      <div class="dashboard">
        <div class="calendar-container">
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/Sidebar.vue' 
import Calendar from '../components/Calendar.vue'
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.min-h-screen {
  display: flex;
  height: 100vh;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.main-content {
  margin-left: 250px;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.dashboard {
  height: 100%;
  overflow-y: auto;
}

.calendar-container {
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 100%;
  overflow-y: auto;
}
</style>



