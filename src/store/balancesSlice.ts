import { type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { createSelector } from '@reduxjs/toolkit'
import { makeLoadableSlice } from './common'
import type { TokenItem } from '@/hooks/loadables/useLoadBalances'

const { slice, selector } = makeLoadableSlice('balances', undefined as Array<TokenItem> | undefined)

export const balancesSlice = slice
export const selectBalances = selector

export const selectTokens = createSelector(
  selectBalances,
  (balancesState): TokenInfo[] => balancesState.data?.map(({ tokenInfo }) => tokenInfo) ?? [],
)
