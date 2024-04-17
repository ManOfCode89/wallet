import type { DetailedTransaction } from '@/utils/transaction-guards'
import { makeLoadableSlice } from './common'

const { slice, selector } = makeLoadableSlice('txQueue', [] as Array<DetailedTransaction>)

export const txQueueSlice = slice
export const selectTxQueue = selector
