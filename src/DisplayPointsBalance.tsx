import {Box} from "grommet";
import {usePointsBalance} from "./api";
import {convertPointsToDollarAmount, formatCurrency} from "./utils";
import {useBalanceTransactions} from "./api/useBalanceTransactions.ts";
import {DisplayBalanceTransactions} from "./DisplayBalanceTransactions.tsx";
import {RedeemPointsBalance} from "./RedeemPointsBalance.tsx";

export function DisplayPointsBalance() {
  const {points, error, isLoading, setPoints} = usePointsBalance();
  const {transactions, transactionFetchError, getTransactions} = useBalanceTransactions();
  const shouldDisplay = (error: string | undefined, points: number | undefined) => {
    return (!error && points !== undefined && points >= 0);
  }

  return (
    <Box margin-top="small" direction="column" gap="small" align="flex-start">
      {isLoading && <>Loading Points Balance</>}
      {error && <>Could not load points balance: {error}</>}
      {shouldDisplay(error, points) && (
        <Box width="wide">
          <Box margin="small">
            You have {formatCurrency("USD", convertPointsToDollarAmount(points as number))}{" "}
            to use (Points balance: {points})
          </Box>
          {!isLoading && shouldDisplay(error, points) &&
              <RedeemPointsBalance
                  points={points}
                  getTransactions={getTransactions}
                  setPoints={setPoints}
              />
          }
        </Box>
      )}
      <DisplayBalanceTransactions transactions={transactions} transactionFetchError={transactionFetchError}/>
    </Box>
  );
}
