import type { NextPage } from 'next'
import Head from 'next/head'
import { Typography } from '@mui/material'
import Link from 'next/link'
import MUILink from '@mui/material/Link'
import { REPO_URL } from '@/config/constants'

const SafeImprint = () => (
  <div>
    <Typography variant="h1" mb={2}>
      Disclaimer
    </Typography>
    <Typography variant="h3" mb={2}>
      What is Eternal Safe?
    </Typography>
    <Typography mb={2}>
      Eternal Safe is a fork of{' '}
      <Link href={`https://github.com/safe-global/safe-wallet-web`} passHref legacyBehavior>
        <MUILink target="_blank" rel="noreferrer">
          Safe{'{Wallet}'}
        </MUILink>
      </Link>{' '}
      that focuses on privacy and decentralization.
    </Typography>
    <Typography variant="h3" mb={2}>
      Accountability for links
    </Typography>
    <Typography mb={2}>
      Responsibility for the content of external links (to web pages of third parties) lies solely with the operators of
      the linked pages.
    </Typography>
    <Typography variant="h3" mb={2}>
      Copyright
    </Typography>
    <Typography>
      This website and their contents are subject to copyright laws.{' '}
      <Link href={`${REPO_URL}/blob/eternal-safe/LICENSE`} passHref legacyBehavior>
        <MUILink target="_blank" rel="noreferrer">
          The code is open-source, released under GPL-3.0.
        </MUILink>
      </Link>
    </Typography>

    <Typography variant="h1" mt={4} mb={2}>
      Licenses
    </Typography>
    <Typography variant="h3" mb={2}>
      Libraries used in Eternal Safe
    </Typography>
    <Typography mb={2}>
      All of the libraries that we depend on{' '}
      <Link href={`${REPO_URL}/blob/eternal-safe/package.json`} passHref legacyBehavior>
        <MUILink target="_blank" rel="noreferrer">
          can be viewed on GitHub.
        </MUILink>
      </Link>{' '}
      We thank the open source community for all of their contributions.
    </Typography>

    <Typography variant="h1" mt={4} mb={2}>
      Security
    </Typography>
    <Typography variant="h3" mb={2}>
      Responsible disclosure
    </Typography>
    <Typography mb={2}>
      Please DM{' '}
      <Link href={`https://x.com/devanoneth`} passHref legacyBehavior>
        <MUILink target="_blank" rel="noreferrer">
          @devanoneth
        </MUILink>
      </Link>{' '}
      on X.
    </Typography>

    <Typography variant="h1" mt={4} mb={2}>
      Warranty
    </Typography>
    <Typography variant="h3" mb={2}>
      GPL
    </Typography>
    <Typography mb={2}>
      For the developers&apos; and authors&apos; protection, the GPL clearly explains that there is no warranty for this
      free software.
    </Typography>
  </div>
)

const Imprint: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Eternal Safe – Imprint'}</title>
      </Head>

      <main>
        <SafeImprint />
      </main>
    </>
  )
}

export default Imprint
