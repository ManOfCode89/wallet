import type { ReactElement, MouseEvent } from 'react'
import { IconButton, Link, SvgIcon } from '@mui/material'
import ShareIcon from '@/public/images/common/share.svg'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { useShareMagicLink } from '@/hooks/useMagicLink'

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
  )
}

export default TxShareLink
