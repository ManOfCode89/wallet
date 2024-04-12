import { type ReactElement, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import TxList from '@/components/transactions/TxList'
import ErrorMessage from '@/components/tx/ErrorMessage'
import type useTxHistory from '@/hooks/useTxHistory'
import useTxQueue from '@/hooks/useTxQueue'
import PagePlaceholder from '../PagePlaceholder'
import SkeletonTxList from './SkeletonTxList'
import { type TxFilter, useTxFilter } from '@/utils/tx-history-filter'
import { isTransactionListItem, type TransactionListItem } from '@/utils/transaction-guards'
import NoTransactionsIcon from '@/public/images/transactions/no-transactions.svg'
import { useHasPendingTxs } from '@/hooks/usePendingTxs'
import useSafeInfo from '@/hooks/useSafeInfo'

const NoQueuedTxns = () => {
  return <PagePlaceholder img={<NoTransactionsIcon />} text="Queued transactions will appear here" />
}

const getFilterResultCount = (filter: TxFilter, data: Array<TransactionListItem>) => {
  const count = data.filter(isTransactionListItem).length

  return `${count} ${filter.type} transactions found`.toLowerCase()
}

const TxPage = ({
  useTxns,
  isFirstPage,
}: {
  useTxns: typeof useTxHistory | typeof useTxQueue
  onNextPage?: (pageUrl: string) => void
  isFirstPage: boolean
}): ReactElement => {
  const { data, error, loading } = useTxns()
  const [filter] = useTxFilter()
  const isQueue = useTxns === useTxQueue
  const hasPending = useHasPendingTxs()

  return (
    <>
      {isFirstPage && filter && data && (
        <Box display="flex" flexDirection="column" alignItems="flex-end" pt={[2, 0]} pb={3}>
          {getFilterResultCount(filter, data)}
        </Box>
      )}

      {data && data.length > 0 && <TxList items={data} />}

      {isQueue && data?.length === 0 && !hasPending && <NoQueuedTxns />}

      {error && <ErrorMessage>Error loading transactions</ErrorMessage>}

      {/* No skeletons for pending as they are shown above the queue which has them */}
      {loading && !hasPending && <SkeletonTxList />}
    </>
  )
}

const PaginatedTxns = ({ useTxns }: { useTxns: typeof useTxHistory | typeof useTxQueue }): ReactElement => {
  const [pages, setPages] = useState<string[]>([''])
  const [filter] = useTxFilter()
  const { safeAddress, safe } = useSafeInfo()

  // Reset the pages when the Safe Account or filter changes
  useEffect(() => {
    setPages([''])
  }, [filter, safe.chainId, safeAddress, useTxns])

  // Trigger the next page load
  const onNextPage = (pageUrl: string) => {
    setPages((prev) => prev.concat(pageUrl))
  }

  return (
    <Box position="relative">
      {pages.map((pageUrl, index) => (
        <TxPage key={pageUrl} useTxns={useTxns} isFirstPage={index === 0} />
      ))}
    </Box>
  )
}

export default PaginatedTxns
