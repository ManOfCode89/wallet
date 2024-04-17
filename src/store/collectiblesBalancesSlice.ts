import type { SafeCollectibleResponse } from '@safe-global/safe-gateway-typescript-sdk'
import { makeLoadableSlice } from './common'

const { slice, selector } = makeLoadableSlice(
  'collectiblesBalance',
  undefined as Array<SafeCollectibleResponse> | undefined,
)

export const collectiblesBalanceSlice = slice
export const selectCollectibleBalances = selector
