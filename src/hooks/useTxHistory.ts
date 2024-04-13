import { useAppSelector } from '@/store'
import useAsync from './useAsync'
import useSafeInfo from './useSafeInfo'
import { useTxFilter } from '@/utils/tx-history-filter'
import { selectAddedTxs } from '@/store/addedTxsSlice'
import { isEqual } from 'lodash'
import { extractTxDetails } from '@/services/tx/extractTxInfo'
import { enrichTransactionDetailsFromHistory, getTxKeyFromTxId, makeTxFromDetails } from '@/utils/transactions'
import { type DetailedTransaction, isDetailedTransactionListItem } from '@/utils/transaction-guards'
import useExecutedTransactions from '@/hooks/useExecutedTransactions'

const useTxHistory = (): {
  data?: Array<DetailedTransaction>
  error?: string
  loading: boolean
} => {
  // TODO(devanon): use filter
  const [filter] = useTxFilter()

  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)
  const executedTransactions = useExecutedTransactions()

  const [data, error, loading] = useAsync<Array<DetailedTransaction>>(
    async () => {
      if (!transactions || !executedTransactions) {
        return []
      }

      const results = await Promise.all(
        executedTransactions.map(async (executedTx) => {
          let txKey = getTxKeyFromTxId(executedTx.txId)
          if (!txKey) return

          const tx = transactions[txKey]

          if (!tx) {
            // TODO(devanon): return some empty tx box with the most we can, or in L2, return most info
            return
          }

          const details = await extractTxDetails(safeAddress, tx, safe)

          enrichTransactionDetailsFromHistory(details, executedTx)

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
    loading: loading,
  }
}

export default useTxHistory
