import {Box, Button, FormField, Text, TextInput} from "grommet";
import {convertPointsToDollarAmount, convertDollarAmountToPoints} from "./utils";
import {redeemPointsBalance} from "./api/redeemPointsBalance.ts";
import {useState} from "react";
import {useLoginStateController} from "./Login";

// @ts-expect-error for implicit any
export function RedeemPointsBalance({ points, getTransactions, setPoints }) {
  const [pointsInput, setPointsInput] = useState("");
  const { userId } = useLoginStateController();
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
          getTransactions(userId as string);
        })
        .catch( (e: any) => e ? setErrorMessage(e.message) : setErrorMessage("") );
  };

  return (
    <>
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
    </>
  );
}
