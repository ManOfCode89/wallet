import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '../useAsync'
import { Errors, logError } from '@/services/exceptions'
import useSafeInfo from '../useSafeInfo'
import { useSafeSDK } from '@/hooks/coreSDK/safeCoreSDK'
import useIntervalCounter from '@/hooks/useIntervalCounter'
import { POLLING_INTERVAL } from '@/config/constants'
import { useMultiWeb3ReadOnly } from '@/hooks/wallets/web3'
import { useAppDispatch } from '@/store'
import { showNotification } from '@/store/notificationsSlice'
import { getSafeContract } from '@/utils/safe-versions'

export type TxHistoryItem = {
  txId: string
  txHash: string
  safeTxHash: string
  timestamp: number
  executor: string
}

export type TxHistory = {
  [txId: string]: TxHistoryItem
}

export const useLoadTxHistory = (): AsyncResult<TxHistory> => {
  const dispatch = useAppDispatch()
  const provider = useMultiWeb3ReadOnly()
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe
  const [pollCount, resetPolling] = useIntervalCounter(POLLING_INTERVAL)

  const [data, error, loading] = useAsync<TxHistory | undefined>(
    async () => {
      if (!safeAddress || !provider) return

      const safeContract = getSafeContract(safeAddress, safe.version, provider)

      if (!safeContract) return

      const logs = await safeContract.queryFilter(safeContract.filters.ExecutionSuccess(), 0, 'latest')

      let txs = await Promise.all(
        logs.map(async (log) => {
          const [timestamp, executor] = await Promise.all([
            provider.getBlock(log.blockNumber).then((block) => block.timestamp * 1000),
            provider.getTransaction(log.transactionHash).then((tx) => tx.from),
          ])

          return {
            txId: `multisig_${safeAddress}_${log.args.txHash}`,
            txHash: log.transactionHash,
            safeTxHash: log.args.txHash,
            timestamp,
            executor,
          }
        }),
      )

      return txs.reduce((acc, tx) => {
        acc[tx.txId] = tx
        return acc
      }, {} as TxHistory)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeAddress, provider, pollCount],
    false,
  )

  // Log errors
  useEffect(() => {
    if (!error) return
    dispatch(
      showNotification({
        message:
          'Error fetching transaction history. If you see this error often, please consider using a more stable RPC URL.',
        groupKey: 'fetch-tx-history-error',
        variant: 'error',
        detailedMessage: error.message,
      }),
    )
    logError(Errors._602, error.message)
  }, [error, dispatch])

  // Reset the counter when safe address/chainId changes
  useEffect(() => {
    resetPolling()
  }, [resetPolling, safeAddress, chainId])

  return [data, error, loading]
}

export default useLoadTxHistory
