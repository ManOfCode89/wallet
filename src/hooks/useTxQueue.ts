import { useAppSelector } from '@/store'
import useAsync from './useAsync'
import useSafeInfo from './useSafeInfo'
import { type DetailedTransaction, isDetailedTransactionListItem } from '@/utils/transaction-guards'
import { selectAddedTxs } from '@/store/addedTxsSlice'
import { extractTxDetails } from '@/services/tx/extractTxInfo'
import { isEqual } from 'lodash'
import { makeTxFromDetails } from '@/utils/transactions'
import useExecutedTransactions from '@/hooks/useExecutedTransactions'

// TODO(devanon): All of these hooks do similar things, we should extract the concept of queued transactions into a slice so that we can save the transactions in the store and not have to recalculate them every time

const useTxQueue = (): {
  data?: Array<DetailedTransaction>
  error?: string
  loading: boolean
} => {
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)
  const { data: executedTransactions, loading: executedTransactionsLoading } = useExecutedTransactions()

  const [data, error, loading] = useAsync<Array<DetailedTransaction>>(
    async () => {
      if (!transactions || !executedTransactions || !safeAddress || !safe) {
        return []
      }

      const results = await Promise.all(
        Object.values(transactions)
          .reverse()
          .map(async (tx) => {
            const details = await extractTxDetails(safeAddress, tx, safe)

            const executedTransaction = executedTransactions.find((executedTx) => executedTx.txId === details.txId)
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
    [safe, safeAddress, transactions, executedTransactions],
    false,
  )

  return {
    data,
    error: error?.message,
    loading: loading || executedTransactionsLoading,
  }
}

// Get the size of the queue as a string
export const useQueuedTxsLength = (): string => {
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)
  const { data: executedTransactions } = useExecutedTransactions()

  const [data] = useAsync<number | undefined>(
    async () => {
      if (!transactions || !executedTransactions || !safeAddress || !safe) {
        return
      }

      let results = await Promise.all(
        Object.values(transactions)
          .reverse()
          .map(async (tx) => {
            const details = await extractTxDetails(safeAddress, tx, safe)
            const executedTransaction = executedTransactions.find((executedTx) => executedTx.txId === details.txId)
            return executedTransaction === undefined
          }),
      )

      let length = results.filter(Boolean).length
      if (length === 0) return

      return length
    },
    [safe, safeAddress, transactions, executedTransactions],
    false,
  )

  return data?.toString() ?? ''
}

export const useQueuedTxByNonce = (nonce?: number) => {
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)
  const { data: executedTransactions } = useExecutedTransactions()

  const [data] = useAsync<Array<DetailedTransaction>>(
    async () => {
      if (!transactions || !executedTransactions || !safeAddress || !safe || !nonce) {
        return []
      }

      let results = await Promise.all(
        Object.values(transactions)
          .reverse()
          .filter((tx) => tx.data.nonce === nonce)
          .map(async (tx) => {
            const details = await extractTxDetails(safeAddress, tx, safe)

            const executedTransaction = executedTransactions.find((executedTx) => executedTx.txId === details.txId)
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
    [safe, safeAddress, transactions, executedTransactions, nonce],
    false,
  )

  return data
}

export default useTxQueue
