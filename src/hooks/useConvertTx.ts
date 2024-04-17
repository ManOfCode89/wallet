import extractTxInfo from '@/services/tx/extractTxInfo'
import type { TransactionDetails } from '@/utils/transaction-guards'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import EthSignSignature from '@safe-global/safe-core-sdk/dist/src/utils/signatures/SafeSignature'
import EthSafeTransaction from '@safe-global/safe-core-sdk/dist/src/utils/transactions/SafeTransaction'
import { useEffect, useState } from 'react'

export const useSafeTransactionFromDetails = (
  txDetails: TransactionDetails | undefined,
): SafeTransaction | undefined => {
  const [safeTx, setSafeTx] = useState<SafeTransaction | undefined>()

  useEffect(() => {
    if (txDetails) {
      const { txParams, signatures } = extractTxInfo(txDetails, txDetails.safeAddress)

      const safeTx = new EthSafeTransaction(txParams)
      Object.entries(signatures).forEach(([signer, data]) => {
        safeTx.addSignature(new EthSignSignature(signer, data))
      })

      setSafeTx(safeTx)
    }
  }, [txDetails])

  return safeTx
}
