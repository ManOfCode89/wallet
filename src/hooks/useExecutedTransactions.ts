import { useAppSelector } from '@/store'
import { isEqual } from 'lodash'
import { selectTxHistory } from '@/store/txHistorySlice'
import { useMemo } from 'react'

export const useExecutedTransaction = (txId?: string) => {
  const { data } = useAppSelector((state) => selectTxHistory(state), isEqual)

  return useMemo(() => {
    return data?.find((tx) => tx.txId === txId)
  }, [data, txId])
}

const useExecutedTransactions = () => {
  const { data } = useAppSelector((state) => selectTxHistory(state), isEqual)

  return useMemo(() => {
    return data
  }, [data])
}

export default useExecutedTransactions
