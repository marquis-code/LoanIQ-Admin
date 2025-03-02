export interface Session {
    id: string
    userId: string
    location: string
    time: string
    device: string
    createdAt: string
    updatedAt: string
  }
  
  export interface Activity {
    id: string
    sessionId: string
    action: string
    description: string
    createdAt: string
    updatedAt: string
  }
  
  