<template>
    <div class="test-notifications">
      <h1>Test Admin Notifications</h1>
      
      <div class="card">
        <h2>Send Test Notification</h2>
        <div class="form-group">
          <label for="message">Message</label>
          <input 
            type="text" 
            id="message" 
            v-model="notificationMessage" 
            placeholder="Enter notification message"
          />
        </div>
        
        <div class="form-group">
          <label for="type">Type</label>
          <select id="type" v-model="notificationType">
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
        </div>
        
        <button class="send-button" @click="sendTestNotification">
          Send Notification
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const notificationMessage = ref('This is a test notification')
  const notificationType = ref<'info' | 'warning' | 'error' | 'success'>('info')
  
  // This function simulates sending a notification through the WebSocket
  const sendTestNotification = () => {
    // In a real application, you would emit this through your WebSocket
    // Here we're simulating the server sending a notification by dispatching a custom event
    const notificationEvent = new CustomEvent('admin-notification', {
      detail: {
        id: `test-${Date.now()}`,
        message: notificationMessage.value,
        type: notificationType.value,
        timestamp: new Date().toISOString()
      }
    })
    
    window.dispatchEvent(notificationEvent)
    
    // Listen for the custom event in the WebSocket implementation
    document.addEventListener('admin-notification', (e: any) => {
      const socket = (window as any).socket
      if (socket) {
        socket.emit('admin-notification', e.detail)
      }
    }, { once: true })
    
    // Show success message
    alert(`Test notification sent: ${notificationMessage.value}`)
  }
  </script>
  
  <style scoped>
  .test-notifications {
    max-width: 600px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #555;
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  .send-button {
    background-color: #f43f5e;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 1rem;
  }
  
  .send-button:hover {
    background-color: #e11d48;
  }
  </style>