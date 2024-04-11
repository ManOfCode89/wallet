import { type ReactElement } from 'react'
import { isDateLabel, isDetailedTransactionListItem, isLabelListItem } from '@/utils/transaction-guards'
import GroupLabel from '@/components/transactions/GroupLabel'
import TxDateLabel from '@/components/transactions/TxDateLabel'
import ExpandableTransactionItem from './ExpandableTransactionItem'
import type { DetailedTransactionListItem } from '@/components/common/PaginatedTxns'
import type { TransactionListItem } from '@safe-global/safe-gateway-typescript-sdk'

type TxListItemProps = {
  item: DetailedTransactionListItem | TransactionListItem
}

const TxListItem = ({ item }: TxListItemProps): ReactElement | null => {
  if (isLabelListItem(item)) {
    return <GroupLabel item={item} />
  }
  if (isDetailedTransactionListItem(item)) {
    return <ExpandableTransactionItem item={item} txDetails={item.details} />
  }
  if (isDateLabel(item)) {
    return <TxDateLabel item={item} />
  }
  return null
}

export default TxListItem
