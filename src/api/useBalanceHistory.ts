import { useCallback, useEffect, useState } from "react";
import { useLoginStateController } from "../Login";

export const POINTS_BALANCE_KEY = "POINTS_BALANCE";

// ToDo: We can do better with property names.  Backend can send output camelCased.
export interface Transaction {
  id?: number;
  startingBalance: number;
  endingBalance: number;
  updatedAt: string;
  createdAt?: string;
  userId?: number;
}

export function useBalanceHistory() {
  const { userId } = useLoginStateController();
  const [transactions, setTransactions] = useState<[Transaction]>();
  const [transactionFetchError, setTransactionFetchError] = useState<string>();
  const currentPage = 1, pageSize = 25; // Static constants for now but we should be able to paginate here...

  const getData = useCallback(async (id: string) => {
    setTransactionFetchError(undefined);

    try {
      const response = await fetch(
        `http://localhost:3000/points/transactions/${id}?page=${currentPage}&page_size=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(await response.json().then(data => data.error_message));
      }
      const data: [Transaction] = await response.json();
      console.log(data);
      setTransactions(data);
    } catch (e: any) {
      setTransactionFetchError(e.message);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getData(userId);
    }
  }, [userId, getData]);

  return { transactions, setTransactions, transactionFetchError };
}
