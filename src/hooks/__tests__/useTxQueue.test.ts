import { renderHook, waitFor } from '@/tests/test-utils'

import { useQueuedTxsLength } from '../useTxQueue'
import * as store from '@/store'
import { getMockDetailedTx } from '@/tests/mocks/transactions'

describe('useQueuedTxsLength', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return an empty string if there are no queued transactions', async () => {
    jest.spyOn(store, 'useAppSelector').mockReturnValue({ data: [] })

    const { result } = renderHook(useQueuedTxsLength)

    await waitFor(() => {
      expect(result.current).toEqual('')
    })
  })

  it('should return the length of the queue as a string', async () => {
    jest.spyOn(store, 'useAppSelector').mockReturnValue({ data: [getMockDetailedTx({})] })

    const { result } = renderHook(useQueuedTxsLength)

    await waitFor(() => {
      expect(result.current).toEqual('1')
    })
  }, 10000)
})
