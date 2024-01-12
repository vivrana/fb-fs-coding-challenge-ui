import {Box, Button, FormField, TextInput} from "grommet";
import { usePointsBalance } from "./api";
//import { formatCurrency, convertPointsToDollarAmount } from "./utils";
import { useState } from "react";
import { redeemPointsBalance } from "./api/redeemPointsBalance.ts";
import {useLoginStateController} from "./Login";

export function RedeemPointsBalance() {
  const { points, error, isLoading, setPoints } = usePointsBalance();
  const [pointsInput, setPointsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { userId } = useLoginStateController();

  const handlePointRedeem = () => {
    setErrorMessage("");
    if (!points) {
      setErrorMessage("No points to redeem");
    }

    if (!pointsInput) {
      setErrorMessage("Please enter a value between 1 and " + points);
      return;
    }

    redeemPointsBalance(userId, pointsInput)
        .then(data => { console.log("data", data); setPoints(data); })
        .catch( (e: any) => e ? setErrorMessage(e.message) : setErrorMessage("") );
  };

  return (
    (!isLoading && !error && points) &&
      <Box margin="small" direction="row" gap="small" align="flex-end">
        <FormField
            label="Enter Points to Redeem"
            error={errorMessage}
            margin={{
              bottom: "0px",
            }}
        >
          <TextInput
              placeholder="Type here"
              value={pointsInput}
              onChange={(ev) => setPointsInput(ev.target.value)}
          />
        </FormField>
        <Box>
          <Button primary onClick={handlePointRedeem} label="Redeem Points"/>
        </Box>
      </Box>
  );
}
