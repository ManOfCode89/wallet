import { useAppSelector } from '@/store'
import { isEqual } from 'lodash'
import { selectTxHistory } from '@/store/txHistorySlice'
import { useMemo } from 'react'

export const useExecutedTransaction = (txId?: string) => {
  const { data, loading } = useAppSelector((state) => selectTxHistory(state), isEqual)

  return useMemo(() => {
    return { data: data?.find((tx) => tx.txId === txId), loading }
  }, [data, txId, loading])
}

const useExecutedTransactions = () => {
  const { data, loading } = useAppSelector((state) => selectTxHistory(state), isEqual)

  return useMemo(() => {
    return { data, loading }
  }, [data, loading])
}

export default useExecutedTransactions
