import { Box } from "grommet";
import { usePointsBalance } from "./api";
import { formatCurrency, convertPointsToDollarAmount } from "./utils";

export function DisplayPointsBalance() {
  const { data, error, isLoading } = usePointsBalance();
  return (
    <Box margin="small" direction="row" gap="small" align="flex-end">
      {isLoading && <>Loading Points Balance</>}
      {error && <>Could not load points balance: {error.message}</>}
      {data && (
        <>
          You have{" "}
          {formatCurrency("USD", convertPointsToDollarAmount(data.balance))} to
          use (Points balance: {data.balance})
        </>
      )}
    </Box>
  );
}
