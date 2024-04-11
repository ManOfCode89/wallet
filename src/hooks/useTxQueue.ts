import { useAppSelector } from '@/store'
import useAsync from './useAsync'
import { selectTxQueue, selectQueuedTransactionsByNonce } from '@/store/txQueueSlice'
import useSafeInfo from './useSafeInfo'
import { isTransactionListItem } from '@/utils/transaction-guards'
import { selectAddedTxs } from '@/store/addedTxsSlice'
import { extractTxDetails } from '@/services/tx/extractTxInfo'
import { isEqual } from 'lodash'
import type { DetailedTransactionListItem } from '@/components/common/PaginatedTxns'
import { makeTxFromDetails } from '@/utils/transactions'

const useTxQueue = (): {
  data?: Array<DetailedTransactionListItem>
  error?: string
  loading: boolean
} => {
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)

  const [data, error, loading] = useAsync<Array<DetailedTransactionListItem>>(
    async () => {
      if (!transactions) {
        return []
      }

      const results = await Promise.all(
        Object.values(transactions).map(async (tx) => {
          const details = await extractTxDetails(safeAddress, tx, safe)
          const transaction = makeTxFromDetails(details)

          return {
            ...transaction,
            details,
          }
        }),
      )

      return results
    },
    [safe, safeAddress, transactions],
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
