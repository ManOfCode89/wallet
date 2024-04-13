import { useAppSelector } from '@/store'
import { isEqual } from 'lodash'
import { selectTxHistory } from '@/store/txHistorySlice'
import { useMemo } from 'react'

const useExecutedTransactions = () => {
  const { data } = useAppSelector((state) => selectTxHistory(state), isEqual)

  return useMemo(() => {
    return data
  }, [data])
}

export default useExecutedTransactions
