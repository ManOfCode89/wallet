import type { ReactElement } from 'react'
import type { TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { isCustomTxInfo } from '@/utils/transaction-guards'
import { InfoDetails } from '@/components/transactions/InfoDetails'
import EthHashInfo from '@/components/common/EthHashInfo'
import { HexEncodedData } from '@/components/transactions/HexEncodedData'
import { MethodDetails } from '@/components/transactions/TxDetails/TxData/DecodedData/MethodDetails'

interface Props {
  txData: TransactionDetails['txData']
  txInfo: TransactionDetails['txInfo']
}

export const DecodedData = ({ txData, txInfo }: Props): ReactElement | null => {
  // unknown tx
  if (!txData) {
    return (
      <InfoDetails title="Unknown transaction:">
        Full details for this transaction must be recovered through the smart link or data export from another signer.
      </InfoDetails>
    )
  }

  let decodedData = <></>
  if (txData.dataDecoded) {
    decodedData = <MethodDetails data={txData.dataDecoded} addressInfoIndex={txData.addressInfoIndex} />
  } else if (txData.hexData) {
    // When no decoded data, display raw hex data
    decodedData = <HexEncodedData title="Data (hex encoded)" hexData={txData.hexData} />
  }

  // we render the decoded data
  return (
    <>
      <InfoDetails title="Interact with:">
        <EthHashInfo
          address={txData.to.value}
          name={isCustomTxInfo(txInfo) ? txInfo.to.name : undefined}
          customAvatar={isCustomTxInfo(txInfo) ? txInfo.to.logoUri : undefined}
          shortAddress={false}
          showCopyButton
          hasExplorer
        />
      </InfoDetails>

      {decodedData}
    </>
  )
}

export default DecodedData
