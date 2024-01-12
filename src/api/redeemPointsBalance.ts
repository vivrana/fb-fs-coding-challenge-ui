export const POINTS_BALANCE_KEY = "POINTS_BALANCE";

export async function redeemPointsBalance(userId: string|null, points: string) {
  if (!points) {
    throw new Error("points should be more than 0");
  }

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points: points })
  };
  const response = await fetch(
    `http://localhost:3000/points/redeem/${userId}`,
      requestOptions,
  );
  if (!response.ok) {
    throw new Error(await response.json().then( (data) => data.error_message ));
  }
  const data: { balance: number } = await response.json();
  return data.balance;
}
