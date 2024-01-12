import {Box, Button, DataTable, FormField, Text, TextInput} from "grommet";
import { usePointsBalance } from "./api";
import {formatCurrency, convertPointsToDollarAmount, convertDollarAmountToPoints} from "./utils";
import {redeemPointsBalance} from "./api/redeemPointsBalance.ts";
import {useState} from "react";
import {useLoginStateController} from "./Login";
import {Transaction, useBalanceHistory} from "./api/useBalanceHistory.ts";

export function DisplayPointsBalance() {
  const { points, error, isLoading, setPoints } = usePointsBalance();
  const [pointsInput, setPointsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const { userId } = useLoginStateController();
  const { transactions, transactionFetchError } = useBalanceHistory();
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

  const handlePointRedeem = () => {
    setRedeemSuccess(false)
    setErrorMessage("");
    if (!points) {
      setErrorMessage("No points to redeem");
      return
    }

    if (!pointsInput) {
      setErrorMessage("Please enter a value between 1 and " + convertPointsToDollarAmount(points as number));
      return;
    }

    redeemPointsBalance(userId, pointsInput)
        .then((user) => {
          setPoints(user.balance);
          setRedeemSuccess(true);
        })
        .catch( (e: any) => e ? setErrorMessage(e.message) : setErrorMessage("") );
  };

  return (
    <Box margin-top="small" direction="column" gap="small" align="flex-start">
      {isLoading && <>Loading Points Balance</>}
      {error && <>Could not load points balance: {error}</>}
      {(!error && points !== undefined && points >= 0) && (
          <Box width="wide">
            <Box margin="small">
              You have {formatCurrency("USD", convertPointsToDollarAmount(points as number))}{" "}
              to use (Points balance: {points})
            </Box>
            <Box margin-top="small" direction="row" width="wide">
              <FormField
                  label="Enter Amount in USD"
                  error={errorMessage}
                  margin={{
                    bottom: "0px",
                  }}
              >
                <TextInput
                    placeholder="Type here"
                    value={pointsInput}
                    onChange={(ev) => {
                      setRedeemSuccess(false);
                      setPointsInput(ev.target.value);
                    }}
                />
              </FormField>
              <Box>
                <Button primary onClick={handlePointRedeem} label="Redeem"/>
              </Box>
            </Box>
            <Box margin="small">
              {pointsInput && !isNaN(Number(pointsInput)) && <>({convertDollarAmountToPoints(pointsInput)} points)</>}
            </Box>

            {redeemSuccess && <Text color="focus" size="large">You just redeemed {pointsInput} points!</Text>}
          </Box>
      )}

      { transactionFetchError && <Text>{transactionFetchError}</Text> }
      { !transactionFetchError &&
      <DataTable
          aria-describedby="storage-pools-heading"
          data={transactions}
          columns={columns}
          fill
          pin
          sortable
      />
      }
    </Box>
  );
}
