import type { listenerMiddlewareInstance, RootState } from '@/store'
import { txDispatch, TxEvent } from '@/services/tx/txEvents'
import { selectPendingTxs } from './pendingTxsSlice'
import { makeLoadableSlice } from './common'
import type { TxHistory, TxHistoryItem } from '@/hooks/loadables/useLoadTxHistory'
import { createSelector } from '@reduxjs/toolkit'

const { slice, selector } = makeLoadableSlice('txHistory', undefined as TxHistory | undefined)

export const txHistorySlice = slice
export const selectTxHistory = selector

export const selectTxFromHistory = createSelector(
  [selectTxHistory, (_: RootState, txId: string | undefined) => [txId]],
  (txHistory, [txId]): TxHistoryItem | undefined => (txId ? txHistory?.data?.[txId] : undefined),
)

export const txHistoryListener = (listenerMiddleware: typeof listenerMiddlewareInstance) => {
  listenerMiddleware.startListening({
    actionCreator: txHistorySlice.actions.set,
    effect: (action, listenerApi) => {
      if (!action.payload.data) {
        return
      }

      const pendingTxs = selectPendingTxs(listenerApi.getState())

      for (const item of Object.values(action.payload.data)) {
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
