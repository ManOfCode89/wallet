import { Button, IconButton, InputAdornment, SvgIcon, TextField, Tooltip, Typography } from '@mui/material'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectSettings, setRpc } from '@/store/settingsSlice'
import { useForm, FormProvider } from 'react-hook-form'
import useChainId from '@/hooks/useChainId'
import InfoIcon from '@/public/images/notifications/info.svg'
import { useCurrentChain } from '@/hooks/useChains'

export enum LoadRPCVariablesField {
  rpc = 'rpc',
}

export type LoadRPCFormData = {
  [LoadRPCVariablesField.rpc]: string
}

type LoadRPCUrlProps = {
  hideRpcInput: () => void
}

const LoadRPCUrl = ({ hideRpcInput }: LoadRPCUrlProps) => {
  const chainId = useChainId()
  const chain = useCurrentChain()
  const settings = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()

  const formMethods = useForm<LoadRPCFormData>({
    mode: 'onChange',
    values: {
      [LoadRPCVariablesField.rpc]: settings.env?.rpc[chainId] ?? chain?.publicRpcUri.value ?? '',
    },
  })

  const { register, handleSubmit, formState, setValue, watch } = formMethods

  const rpc = watch(LoadRPCVariablesField.rpc)

  const onSubmit = handleSubmit((data) => {
    dispatch(
      setRpc({
        chainId,
        rpc: data[LoadRPCVariablesField.rpc],
      }),
    )
    hideRpcInput()
  })

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <Typography fontWeight={700} mb={2} mt={3}>
          RPC provider
          <Tooltip
            placement="top"
            arrow
            title="Any provider that implements the Ethereum JSON-RPC standard can be used."
          >
            <span>
              <SvgIcon
                component={InfoIcon}
                inheritViewBox
                fontSize="small"
                color="border"
                sx={{ verticalAlign: 'middle', ml: 0.5 }}
              />
            </span>
          </Tooltip>
        </Typography>

        <TextField
          {...register(LoadRPCVariablesField.rpc, { required: true })}
          variant="outlined"
          type="url"
          InputProps={{
            endAdornment: rpc ? null : (
              <InputAdornment position="end">
                <Tooltip title="Reset to default value">
                  <IconButton
                    onClick={() =>
                      setValue(
                        LoadRPCVariablesField.rpc,
                        settings.env?.rpc[chainId] ?? chain?.publicRpcUri.value ?? '',
                        { shouldValidate: true },
                      )
                    }
                    size="small"
                    color="primary"
                  >
                    <RotateLeftIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          sx={{ mt: 2 }}
          disabled={!formState.isValid}
        >
          Save
        </Button>
      </form>
    </FormProvider>
  )
}

export default LoadRPCUrl
