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

export const useQueuedTxsLength = (): number => {
  const { data } = useAppSelector((state) => selectTxQueue(state), isEqual)

  return useMemo(() => data.length, [data])
}

export const useQueuedTxByNonce = (nonce?: number) => {
  const { data } = useAppSelector((state) => selectTxQueue(state), isEqual)

  return useMemo(() => {
    return data.filter((tx) => tx.details.detailedExecutionInfo.nonce === nonce)
  }, [data, nonce])
}

export default useTxQueue
