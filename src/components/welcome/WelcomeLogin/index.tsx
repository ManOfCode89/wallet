import { Paper, Typography, Box, Link } from '@mui/material'
import css from './styles.module.css'
import LoadSafe from './LoadSafe'
import { useCurrentChain } from '@/hooks/useChains'
import { useAppSelector } from '@/store'
import { selectRpc } from '@/store/settingsSlice'
import LoadRPCUrl from '@/components/welcome/WelcomeLogin/LoadRPCUrl'
import { CHAINLIST_CHAIN_URL } from '@/config/constants'

const WelcomeLogin = () => {
  const chain = useCurrentChain()
  const customRpc = useAppSelector(selectRpc)
  const customRpcUrl = chain ? customRpc?.[chain.chainId] : undefined

  const providedPublic = chain?.publicRpcUri.value
    ? ` We have detected and prefilled a public RPC URL for ${chain.chainName}. More public URLs can be found on `
    : ` If you don't have one, you can find a public RPC URL on `

  return (
    <Paper className={css.loginCard} data-testid="welcome-login">
      <Box className={css.loginContent}>
        <Typography variant="h3" mt={6} fontWeight={700}>
          Eternal Safe
        </Typography>
        {customRpcUrl ? (
          <>
            <Typography mb={2} textAlign="center">
              Eternal Safe does not yet support creating a Safe, you must have one already created.
            </Typography>
            <LoadSafe />
          </>
        ) : chain ? (
          <>
            <Typography mb={2} textAlign="center">
              Welcome! <br />
              <br />
              To get started you must provide a RPC URL for the {chain.chainName} network.
              <br />
              <br />
              {providedPublic}
              <Link href={`${CHAINLIST_CHAIN_URL}${chain.chainId}`} color="primary" target="_blank" rel="noreferrer">
                Chainlist
              </Link>
              .
              <br />
              <br />
              You can change this later in the settings.
            </Typography>
            <LoadRPCUrl />
          </>
        ) : (
          <Typography mb={2} textAlign="center">
            Please select a network from the dropdown above to get started.
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default WelcomeLogin
