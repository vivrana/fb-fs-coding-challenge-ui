import {Box, Button, FormField, TextInput} from "grommet";
import { usePointsBalance } from "./api";
//import { formatCurrency, convertPointsToDollarAmount } from "./utils";
import { useState } from "react";
import { updatePointsBalance } from "./api/updatePointsBalance.ts";
import {useLoginStateController} from "./Login";

export function RedeemPointsBalance() {
  const { points, error, isLoading, setPoints } = usePointsBalance();
  const [pointsInput, setPointsInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { userId } = useLoginStateController();

  const handlePointRedeem = () => {
    setErrorMessage("");
    if (!points){
      setErrorMessage("No points to redeem");
    }

    // @ts-expect-error we already check whether `points` are undefined.  No need to recheck below.
    if (!pointsInput || pointsInput > points ) {
      setErrorMessage("Please enter a value between 1 and " + points);
      return;
    }

    updatePointsBalance(userId, pointsInput)
        .then(data => setPoints(data))
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
              placeholder={points}
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
