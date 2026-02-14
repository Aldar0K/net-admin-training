import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const getMessageFromData = (data: unknown): string | null => {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data
  }

  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message?: unknown }).message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }
  }

  return null
}

export const getRtkQueryErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = 'Request failed',
): string => {
  if (!error) {
    return fallback
  }

  if ('status' in error) {
    const dataMessage = getMessageFromData(error.data)
    if (dataMessage) {
      return dataMessage
    }

    const status = typeof error.status === 'string' ? error.status : String(error.status)
    return `${fallback} (${status})`
  }

  return error.message ?? fallback
}
