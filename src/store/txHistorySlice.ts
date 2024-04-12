import type { listenerMiddlewareInstance } from '@/store'
import { txDispatch, TxEvent } from '@/services/tx/txEvents'
import { selectPendingTxs } from './pendingTxsSlice'
import { makeLoadableSlice } from './common'
import type { TxHistoryItem } from '@/hooks/loadables/useLoadTxHistory'

const { slice, selector } = makeLoadableSlice('txHistory', undefined as Array<TxHistoryItem> | undefined)

export const txHistorySlice = slice
export const selectTxHistory = selector

export const txHistoryListener = (listenerMiddleware: typeof listenerMiddlewareInstance) => {
  listenerMiddleware.startListening({
    actionCreator: txHistorySlice.actions.set,
    effect: (action, listenerApi) => {
      if (!action.payload.data) {
        return
      }

      const pendingTxs = selectPendingTxs(listenerApi.getState())

      for (const item of action.payload.data) {
        if (pendingTxs[item.txId]) {
          txDispatch(TxEvent.SUCCESS, {
            ...item,
            groupKey: pendingTxs[item.txId].groupKey,
          })
        }
      }
    },
  })
}
