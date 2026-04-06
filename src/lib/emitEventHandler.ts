import axios from 'axios'
import React from 'react'

const emitEventHandler =async (event: string, data: any, socketId?: string) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {
      event,
      data,
      socketId
    })
  } catch (error) {
    return { success: false, error }
  }
}

export default emitEventHandler
