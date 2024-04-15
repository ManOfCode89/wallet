import memoize from 'lodash/memoize'
import { getTransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'

/**
 * Fetch and memoize transaction details from Safe Gateway
 *
 * @param chainId Chain id
 * @param id Transaction id or hash
 * @returns Transaction details
 */
export const getTxDetails = memoize(
  (chainId: string, id: string) => {
    //TODO(devanon): Remove or replace CGW usage
    return getTransactionDetails(chainId, id)
  },
  (id: string, chainId: string) => `${chainId}-${id}`,
)
