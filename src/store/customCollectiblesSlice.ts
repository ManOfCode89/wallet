import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/store'

export type CollectibleData = {
  address: string
  name: string
  symbol: string
}

// chainId -> collectibles
export type CustomCollectiblesState = Record<string, Array<CollectibleData>>

const initialState: CustomCollectiblesState = {}

export const customCollectiblesSlice = createSlice({
  name: 'customCollectibles',
  initialState,
  reducers: {
    setCustomCollectibles(_, action: PayloadAction<CustomCollectiblesState>) {
      return action.payload
    },
    add: (state, action: PayloadAction<[string, CollectibleData]>) => {
      const [chainId, token] = action.payload

      if (!state[chainId]) {
        state[chainId] = []
      }
      const chainState = state[chainId]

      const existingIndex = chainState.findIndex((t) => t.address === token.address)
      if (existingIndex !== -1) {
        chainState[existingIndex] = { ...token }
      } else {
        chainState.push({ ...token })
      }
    },
    remove: (state, action: PayloadAction<[string, string]>) => {
      const [chainId, address] = action.payload

      if (!state[chainId]) {
        return
      }
      const chainState = state[chainId]

      const index = chainState.findIndex((t) => t.address === address)
      if (index !== -1) {
        chainState.splice(index, 1)
      }
    },
  },
})

export const { add, remove } = customCollectiblesSlice.actions

export const selectCustomCollectibles = (state: RootState): CustomCollectiblesState => {
  return state[customCollectiblesSlice.name]
}

export const selectCustomCollectiblesByChain = createSelector(
  [selectCustomCollectibles, (_, chainId: string | undefined) => chainId],
  (customTokens, chainId): Array<CollectibleData> => {
    return chainId ? customTokens[chainId] ?? [] : []
  },
)
