import { renderHook, waitFor } from '@/tests/test-utils'

import { useQueuedTxsLength } from '../useTxQueue'
import * as store from '@/store'
import type { SafeInfo, TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import * as extractTxInfo from '@/services/tx/extractTxInfo'
import * as useSafeInfo from '@/hooks/useSafeInfo'
import * as useExecutedTransactions from '@/hooks/useExecutedTransactions'
import { OperationType, type SafeTransaction } from '@safe-global/safe-core-sdk-types'

const SAFE_ADDRESS = '0x87a57cBf742CC1Fc702D0E9BF595b1E056693e2f'

const txDetails = {
  txId: 'multisig_0x87a57cBf742CC1Fc702D0E9BF595b1E056693e2f_0x236da79434c398bf98b204e6f3d93d',
  safeAddress: SAFE_ADDRESS,
  txInfo: {
    type: 'Custom',
    to: {
      value: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    },
  },
} as TransactionDetails

jest
  .spyOn(extractTxInfo, 'extractTxDetails')
  .mockImplementation((safeAddress: string, safeTx: SafeTransaction, safe: SafeInfo, txId?: string) => {
    return Promise.resolve(txDetails)
  })

jest.spyOn(useSafeInfo, 'default').mockImplementation(() => ({
  safeAddress: SAFE_ADDRESS,
  safe: {
    chainId: '5',
  } as SafeInfo,
  safeError: undefined,
  safeLoading: false,
  safeLoaded: true,
}))

jest.spyOn(useExecutedTransactions, 'default').mockImplementation(() => ({
  data: [],
  error: undefined,
  loading: false,
}))

describe('useQueuedTxsLength', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return an empty string if there are no queued transactions', async () => {
    jest.spyOn(store, 'useAppSelector').mockReturnValue({})

    const { result } = renderHook(useQueuedTxsLength)

    await waitFor(() => {
      expect(result.current).toEqual('')
    })
  })

  it('should return the length of the queue as a string', async () => {
    jest.spyOn(store, 'useAppSelector').mockReturnValue({
      multisig_0x87a57cBf742CC1Fc702D0E9BF595b1E056693e2f_0x236da79434c398bf98b204e6f3d93d: {
        data: '0x',
        baseGas: 21000,
        gasPrice: 10000000000,
        safeTxGas: 11000,
        gasToken: '0x0000000000000000000000000000000000000000',
        nonce: 0,
        refundReceiver: '0x1234567890123456789012345678901234567890',
        value: '1000000000000000000',
        to: '0x1234567890123456789012345678901234567890',
        operation: OperationType.Call,
      },
    })

    const { result } = renderHook(useQueuedTxsLength)

    await waitFor(() => {
      expect(result.current).toEqual('1')
    })
  }, 10000)
})
