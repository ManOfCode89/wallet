import { TransactionStatus } from '@safe-global/safe-gateway-typescript-sdk'
import { useAppSelector } from '@/store'
import useAsync from './useAsync'
import useSafeInfo from './useSafeInfo'
import { useTxFilter } from '@/utils/tx-history-filter'
import { selectAddedTxs } from '@/store/addedTxsSlice'
import { isEqual } from 'lodash'
import { extractTxDetails } from '@/services/tx/extractTxInfo'
import { selectTxHistory } from '@/store/txHistorySlice'
import { makeTxFromDetails } from '@/utils/transactions'
import {
  type DetailedTransaction,
  isDetailedTransactionListItem,
  isMultisigDetailedExecutionInfo,
} from '@/utils/transaction-guards'
import { addressEx } from '@/utils/addresses'

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

          if (!executedTransaction) return

          details.txStatus = TransactionStatus.SUCCESS
          details.txHash = executedTransaction.txHash
          details.executedAt = executedTransaction.timestamp

          if (isMultisigDetailedExecutionInfo(details.detailedExecutionInfo)) {
            details.detailedExecutionInfo.executor = addressEx(executedTransaction.executor)
          }

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

export default useTxHistory
