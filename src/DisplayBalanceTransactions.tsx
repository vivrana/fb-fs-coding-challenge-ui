import {Box, DataTable, Heading, Text} from "grommet";
import {Transaction} from "./api/useBalanceTransactions.ts";

// @ts-expect-error for transactions and transactionFetchError implicit any
export function DisplayBalanceTransactions({transactions, transactionFetchError}) {
  const columns = [
    {
      property: 'starting_balance',
      header: 'Starting Balance',
      render: (datum: Transaction) => <Text truncate>{datum.startingBalance}</Text>,
    },
    {
      property: 'ending_balance',
      header: 'Ending Balance',
      render: (datum: Transaction) => <Text truncate>{datum.endingBalance}</Text>,
    },
    {
      property: 'updated_at',
      header: 'Changed At',
      render: (datum: Transaction) => <Text truncate>{datum.updatedAt}</Text>,
      sortable: true,
    },
  ];

  return (
    <>
      {transactionFetchError && <Text>{transactionFetchError}</Text>}
      {!transactionFetchError && transactions && transactions.length > 0 &&
          <Box>
              <Heading id="balance-transactions">Balance Transactions</Heading>
              <DataTable
                  aria-describedby="balance-transactions"
                  data={transactions}
                  columns={columns}
                  fill
                  pin
                  sortable
              />
          </Box>
      }
    </>
  );
}
