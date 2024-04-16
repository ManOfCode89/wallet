import { useEffect } from 'react'

import { useCurrentChain } from '@/hooks/useChains'
import useWallet from '@/hooks/wallets/useWallet'
import {
  createMultiWeb3ReadOnly,
  createWeb3,
  createWeb3ReadOnly,
  setMultiWeb3ReadOnly,
  setWeb3,
  setWeb3ReadOnly,
} from '@/hooks/wallets/web3'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectRpc } from '@/store/settingsSlice'
import { useRouter } from 'next/router'
import { AppRoutes } from '@/config/routes'
import { showNotification } from '@/store/notificationsSlice'

export const useInitWeb3 = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const chain = useCurrentChain()
  const chainId = chain?.chainId
  const wallet = useWallet()
  const customRpc = useAppSelector(selectRpc)
  const customRpcUrl = chain ? customRpc?.[chain.chainId] : undefined

  useEffect(() => {
    if (wallet && wallet.chainId === chainId) {
      const web3 = createWeb3(wallet.provider)
      setWeb3(web3)
    } else {
      setWeb3(undefined)
    }
  }, [wallet, chainId])

  useEffect(() => {
    if (!customRpcUrl) {
      setWeb3ReadOnly(undefined)
      setMultiWeb3ReadOnly(undefined)

      if (chain && router.pathname !== AppRoutes.welcome.index) {
        dispatch(
          showNotification({
            message: `No RPC URL saved for ${chain.chainName ?? 'this'} network. You must provide one to continue.`,
            groupKey: 'custom-rpc-url-error',
            variant: 'error',
          }),
        )
        router.push({ pathname: AppRoutes.welcome.index, query: { chain: chain.shortName } })
      }
      return
    }
    const web3ReadOnly = createWeb3ReadOnly(customRpcUrl)
    web3ReadOnly._networkPromise.then((network) => {
      if (network.chainId === Number(chainId)) {
        setWeb3ReadOnly(web3ReadOnly)
      }

      const multiWeb3ReadOnly = createMultiWeb3ReadOnly(customRpcUrl, network)
      setMultiWeb3ReadOnly(multiWeb3ReadOnly)
      multiWeb3ReadOnly.getNetwork().then((network) => {
        if (network.chainId === Number(chainId)) setMultiWeb3ReadOnly(multiWeb3ReadOnly)
      })
    })
  }, [customRpcUrl, chain, router, dispatch])
}
