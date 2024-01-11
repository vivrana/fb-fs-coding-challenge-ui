import { useCallback, useEffect, useState } from "react";
import { useLoginStateController } from "../Login";

export const POINTS_BALANCE_KEY = "POINTS_BALANCE";

export function usePointsBalance() {
  const { userId } = useLoginStateController();
  const [points, setPoints] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const getData = useCallback(async (id: string) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/points/balance/${id}`
      );
      const data: { balance: number } = await response.json();

      setIsLoading(false);
      setPoints(data.balance);
    } catch (_e) {
      setError("Unknown error");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getData(userId);
    }
  }, [userId, getData]);

  return { points, isLoading, error };
}
