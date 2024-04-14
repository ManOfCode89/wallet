import type { ReactElement, MouseEvent } from 'react'
import { IconButton, Link, SvgIcon } from '@mui/material'
import ShareIcon from '@/public/images/common/share.svg'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { useShareMagicLink } from '@/hooks/useMagicLink'
import { OnboardingTooltip } from '@/components/common/OnboardingTooltip'

const LS_MAGICLINK_ONBOARDING = 'magiclink_onboarding'

const TxShareLink = ({ safeTx }: { safeTx: SafeTransaction }): ReactElement => {
  const [isCopyEnabled, setIsCopyEnabled] = useState(true)
  const tx = useShareMagicLink(safeTx)

  const router = useRouter()
  const { safe = '' } = router.query
  const href = `${AppRoutes.transactions.tx}?safe=${safe}&tx=${tx}`

  const onClick = (e: MouseEvent) => {
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault()
    }

    try {
      // copy href to clipboard
      navigator.clipboard.writeText(location.origin + href)
    } catch (error) {
      console.error(error)
      setIsCopyEnabled(false)
    }
  }

  return (
    <OnboardingTooltip
      widgetLocalStorageId={LS_MAGICLINK_ONBOARDING}
      text={
        <>
          Eternal Safe relies on magic links to share transaction details.
          <br />
          These links are unique to each transaction and should be shared with other signers in order to collect
          signatures and share full transaction details.
        </>
      }
      postText="Copy magic link to clipboard"
    >
      <IconButton
        data-testid="share-btn"
        component={Link}
        aria-label="Share"
        href={href}
        onClick={onClick}
        disabled={!isCopyEnabled}
      >
        <SvgIcon component={ShareIcon} inheritViewBox fontSize="small" color="border" />
      </IconButton>
    </OnboardingTooltip>
  )
}

export default TxShareLink
