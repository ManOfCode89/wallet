import type { DetailedTransaction } from '@/utils/transaction-guards'
import { makeLoadableSlice } from './common'

const { slice, selector } = makeLoadableSlice('txQueue', undefined as Array<DetailedTransaction> | undefined)

export const txQueueSlice = slice
export const selectTxQueue = selector
