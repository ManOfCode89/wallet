import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '../useAsync'
import { Errors, logError } from '@/services/exceptions'
import useSafeInfo from '../useSafeInfo'
import { useSafeSDK } from '@/hooks/coreSDK/safeCoreSDK'
import useIntervalCounter from '@/hooks/useIntervalCounter'
import { POLLING_INTERVAL } from '@/config/constants'
import { useMultiWeb3ReadOnly } from '@/hooks/wallets/web3'
import {
  Gnosis_safe_l2__factory,
  Gnosis_safe__factory,
} from '@/types/contracts/factories/@safe-global/safe-deployments/dist/assets/v1.3.0'

export type TxHistoryItem = {
  txId: string
  txHash: string
  timestamp: number
  executor: string
}

export const useLoadTxHistory = (): AsyncResult<Array<TxHistoryItem>> => {
  const sdk = useSafeSDK()
  const provider = useMultiWeb3ReadOnly()
  const { safe, safeAddress } = useSafeInfo()
  const { chainId } = safe
  const [pollCount, resetPolling] = useIntervalCounter(POLLING_INTERVAL)

  // Re-fetch when chainId/address, or txHistoryTag change
  const [data, error, loading] = useAsync<Array<TxHistoryItem> | undefined>(
    async () => {
      if (!safeAddress || !provider || !sdk) return

      let safeContract

      //TODO(devanon): Support all versions, for now just assumes v1.3.0
      if (sdk.getContractManager().isL1SafeMasterCopy) {
        safeContract = Gnosis_safe__factory.connect(safeAddress, provider)
      } else {
        safeContract = Gnosis_safe_l2__factory.connect(safeAddress, provider)
      }

      const logs = await safeContract.queryFilter(safeContract.filters.ExecutionSuccess(), 0, 'latest')

      return await Promise.all(
        logs.map(async (log) => {
          const [timestamp, executor] = await Promise.all([
            provider.getBlock(log.blockNumber).then((block) => block.timestamp * 1000),
            provider.getTransaction(log.transactionHash).then((tx) => tx.from),
          ])

          return {
            txId: `multisig_${safeAddress}_${log.args.txHash}`,
            txHash: log.transactionHash,
            timestamp,
            executor,
          }
        }),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeAddress, provider, pollCount, sdk],
    false,
  )

  // Log errors
  useEffect(() => {
    if (!error) return
    logError(Errors._602, error.message)
  }, [error])

  // Reset the counter when safe address/chainId changes
  useEffect(() => {
    resetPolling()
  }, [resetPolling, safeAddress, chainId])

  return [data, error, loading]
}

export default useLoadTxHistory
