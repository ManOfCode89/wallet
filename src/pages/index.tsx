import { useEffect, useLayoutEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useLastSafe from '@/hooks/useLastSafe'
import { AppRoutes } from '@/config/routes'
import { useAppSelector } from '@/store'
import { selectRpc } from '@/store/settingsSlice'
import useChains from '@/hooks/useChains'
import chains from '@/config/chains'

const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { safe, chain } = router.query
  const { configs } = useChains()
  const chainId = chain?.toString()
    ? chains[chain.toString()] || configs.find((item) => item.shortName === chain.toString())?.chainId
    : undefined
  const lastSafe = useLastSafe()
  const safeAddress = safe || lastSafe
  const customRpc = useAppSelector(selectRpc)
  const customRpcUrl = chainId ? customRpc?.[chainId] : undefined

  useIsomorphicEffect(() => {
    if (router.pathname !== AppRoutes.index) {
      return
    }

    router.replace(
      safeAddress && customRpcUrl
        ? `${AppRoutes.balances.index}?safe=${safeAddress}`
        : chain
        ? `${AppRoutes.welcome.index}?chain=${chain}`
        : AppRoutes.welcome.index,
    )
  }, [router, safeAddress, chain])

  return <></>
}

export default IndexPage
