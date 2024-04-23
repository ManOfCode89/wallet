import { hasSafeFeature as sdkHasSafeFeature } from '@safe-global/safe-core-sdk-utils'
import type { SAFE_FEATURES } from '@safe-global/safe-core-sdk-utils'
import type { SafeInfo } from '@safe-global/safe-gateway-typescript-sdk'
import type { Provider } from '@ethersproject/providers'
import { isValidSafeVersion, type ModernSafeVersion } from '@/hooks/coreSDK/safeCoreSDK'
import { LATEST_SAFE_VERSION } from '@/config/constants'

import { Gnosis_safe__factory as Gnosis_safe__factory111 } from '@/types/contracts/factories/@safe-global/safe-deployments/dist/assets/v1.1.1'
import { Gnosis_safe__factory as Gnosis_safe__factory120 } from '@/types/contracts/factories/@safe-global/safe-deployments/dist/assets/v1.2.0'
import {
  Gnosis_safe_l2__factory as Gnosis_safe_l2__factory130,
  Gnosis_safe__factory as Gnosis_safe__factory130,
} from '@/types/contracts/factories/@safe-global/safe-deployments/dist/assets/v1.3.0'
import {
  Safe_l2__factory as Safe_l2__factory141,
  Safe__factory as Safe__factory141,
} from '@/types/contracts/factories/@safe-global/safe-deployments/dist/assets/v1.4.1'
import type Safe from '@safe-global/safe-core-sdk'

// Note: backend returns `SafeInfo['version']` as `null` for unsupported contracts
export const hasSafeFeature = (feature: SAFE_FEATURES, version: SafeInfo['version']): boolean => {
  if (!version) {
    return false
  }
  return sdkHasSafeFeature(feature, version)
}

export const getSafeContract = (sdk: Safe, safeAddress: string, safeVersion: string | null, provider: Provider) => {
  if (!isValidSafeVersion(safeVersion)) return

  const version: ModernSafeVersion = safeVersion ?? LATEST_SAFE_VERSION

  const factories = {
    '1.1.1': Gnosis_safe__factory111,
    '1.2.0': Gnosis_safe__factory120,
    '1.3.0': sdk.getContractManager().isL1SafeMasterCopy ? Gnosis_safe__factory130 : Gnosis_safe_l2__factory130,
    '1.4.1': sdk.getContractManager().isL1SafeMasterCopy ? Safe__factory141 : Safe_l2__factory141,
  }

  return factories[version].connect(safeAddress, provider)
}
