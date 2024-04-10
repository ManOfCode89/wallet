import { ConflictType, TransactionListItemType } from '@safe-global/safe-gateway-typescript-sdk'
import { useAppSelector } from '@/store'
import useAsync from './useAsync'
import useSafeInfo from './useSafeInfo'
import { useTxFilter } from '@/utils/tx-history-filter'
import { selectAddedTxs } from '@/store/addedTxsSlice'
import { isEqual } from 'lodash'
import { extractTxDetails } from '@/services/tx/extractTxInfo'
import type { DetailedTransactionListItem } from '@/components/common/PaginatedTxns'

const useTxHistory = (): {
  data?: Array<DetailedTransactionListItem>
  error?: string
  loading: boolean
} => {
  const [filter] = useTxFilter()

  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe

  const transactions = useAppSelector((state) => selectAddedTxs(state, chainId, safeAddress), isEqual)

  // If filter exists or pageUrl is passed, load a new history page from the API
  const [data, error, loading] = useAsync<Array<DetailedTransactionListItem>>(
    async () => {
      if (!transactions) {
        return []
      }

      const results = await Promise.all(
        Object.values(transactions).map(async (tx) => {
          const txDetails = await extractTxDetails(safeAddress, tx, safe)
          // TODO(devanon): at this point we have the full txDetails, but we only take some of them
          // they are needed again inside TxDetails component
          // we should pass them all the way down

          return {
            transaction: {
              id: txDetails.txId,
              timestamp: txDetails.executedAt ?? 0,
              txStatus: txDetails.txStatus,
              txInfo: txDetails.txInfo,
              executionInfo: txDetails.detailedExecutionInfo,
              safeAppInfo: txDetails.safeAppInfo,
            },
            details: txDetails,
            conflictType: ConflictType.NONE, // TODO(devanon): Implement conflict type
            type: TransactionListItemType.TRANSACTION,
          } as DetailedTransactionListItem
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

export default useTxHistory
