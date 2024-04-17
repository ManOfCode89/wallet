import { useAppSelector } from '@/store'
import { type DetailedTransaction } from '@/utils/transaction-guards'
import { isEqual } from 'lodash'
import { selectTxQueue } from '@/store/txQueueSlice'
import { useMemo } from 'react'

const useTxQueue = (): {
  data?: Array<DetailedTransaction>
  error?: string
  loading: boolean
} => {
  const { data, loading, error } = useAppSelector((state) => selectTxQueue(state), isEqual)

  return useMemo(() => {
    return {
      data,
      error,
      loading,
    }
  }, [data, loading, error])
}

// Get the size of the queue as a string
export const useQueuedTxsLength = (): string => {
  const { data } = useAppSelector((state) => selectTxQueue(state), isEqual)

  return useMemo(() => {
    if (data.length === 0) return ''
    return data.length.toString()
  }, [data])
}

export const useQueuedTxByNonce = (nonce?: number) => {
  const { data } = useAppSelector((state) => selectTxQueue(state), isEqual)

  return useMemo(() => {
    return data.filter((tx) => tx.details.detailedExecutionInfo.nonce === nonce)
  }, [data, nonce])
}

export default useTxQueue
