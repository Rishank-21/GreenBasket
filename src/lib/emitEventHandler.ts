import axios from 'axios'
import React from 'react'

const emitEventHandler =async (event: string, data: any, socketId?: string) => {
  try {
    const socketServerUrl =
      process.env.SOCKET_SERVER_URL || process.env.NEXT_PUBLIC_SOCKET_SERVER;

    if (!socketServerUrl) {
      return {
        success: false,
        error: new Error("SOCKET_SERVER_URL is not configured"),
      };
    }

    const res = await axios.post(`${socketServerUrl}/notify`, {
      event,
      data,
      socketId
    })
  } catch (error) {
    return { success: false, error }
  }
}

export default emitEventHandler
