import { useAppSelector } from '@/store'
import useAsync from './useAsync'
import { selectTxQueue, selectQueuedTransactionsByNonce } from '@/store/txQueueSlice'
import useSafeInfo from './useSafeInfo'
import {
  type DetailedTransaction,
  isDetailedTransactionListItem,
  isTransactionListItem,
} from '@/utils/transaction-guards'
import { selectAddedTxs } from '@/store/addedTxsSlice'
import { extractTxDetails } from '@/services/tx/extractTxInfo'
import { isEqual } from 'lodash'
import { makeTxFromDetails } from '@/utils/transactions'
import { selectTxHistory } from '@/store/txHistorySlice'

const useTxQueue = (): {
  data?: Array<DetailedTransaction>
  error?: string
  loading: boolean
} => {
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)
  const executedTransactions = useAppSelector((state) => selectTxHistory(state))

  const [data, error, loading] = useAsync<Array<DetailedTransaction>>(
    async () => {
      if (!transactions || !executedTransactions) {
        return []
      }

      const results = await Promise.all(
        Object.values(transactions).map(async (tx) => {
          const details = await extractTxDetails(safeAddress, tx, safe)

          const executedTransaction = executedTransactions.data?.find((executedTx) => executedTx.txId === details.txId)
          if (executedTransaction) return

          const transaction = makeTxFromDetails(details)

          return {
            ...transaction,
            details,
          }
        }),
      )

      return results.filter(isDetailedTransactionListItem)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safe, safeAddress, transactions, executedTransactions.data],
    false,
  )

  return {
    data,
    error: error?.message,
    loading: loading,
  }
}

// Get the size of the queue as a string with an optional '+' if there are more pages
export const useQueuedTxsLength = (): string => {
  const queue = useAppSelector(selectTxQueue)
  const { length } = queue.data?.results.filter(isTransactionListItem) ?? []
  const totalSize = length
  if (!totalSize) return ''
  const hasNextPage = queue.data?.next != null
  return `${totalSize}${hasNextPage ? '+' : ''}`
}

export const useQueuedTxByNonce = (nonce?: number) => {
  return useAppSelector((state) => selectQueuedTransactionsByNonce(state, nonce))
}

export default useTxQueue
