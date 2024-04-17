import useBalances from '@/hooks/useBalances'
import useIsOnlySpendingLimitBeneficiary from '@/hooks/useIsOnlySpendingLimitBeneficiary'
import useSpendingLimit from '@/hooks/useSpendingLimit'
import useWallet from '@/hooks/wallets/useWallet'
import { useAppSelector } from '@/store'
import { selectSpendingLimits } from '@/store/spendingLimitsSlice'
import { sameAddress } from '@/utils/addresses'
import { BigNumber } from '@ethersproject/bignumber'
import { type SafeBalanceResponse } from '@safe-global/safe-gateway-typescript-sdk'

export const useTokenAmount = (selectedToken: SafeBalanceResponse['items'][0] | undefined) => {
  const spendingLimit = useSpendingLimit(selectedToken?.tokenInfo)

  const spendingLimitAmount = BigNumber.from(spendingLimit?.amount || 0).sub(spendingLimit?.spent || 0)
  const totalAmount = BigNumber.from(selectedToken?.balance || 0)

  return { totalAmount, spendingLimitAmount }
}

export const useVisibleTokens = () => {
  const isOnlySpendingLimitBeneficiary = useIsOnlySpendingLimitBeneficiary()
  const { balances } = useBalances()
  const spendingLimits = useAppSelector(selectSpendingLimits)
  const wallet = useWallet()

  if (isOnlySpendingLimitBeneficiary) {
    return balances.filter(({ tokenInfo }) => {
      return spendingLimits?.some(({ beneficiary, token }) => {
        return sameAddress(beneficiary, wallet?.address) && sameAddress(tokenInfo.address, token.address)
      })
    })
  }

  return balances
}
