import { useCallback, useEffect, useState } from "react";
import { useLoginStateController } from "../Login";

export const POINTS_BALANCE_KEY = "POINTS_BALANCE";

export interface Transaction {
  id?: number;
  startingBalance: number;
  endingBalance: number;
  updatedAt: string;
  createdAt?: string;
  userId?: number;
}

export function useBalanceTransactions() {
  const { userId } = useLoginStateController();
  const [transactions, setTransactions] = useState<[Transaction]>();
  const [transactionFetchError, setTransactionFetchError] = useState<string>();
  const currentPage = 1, pageSize = 25; // Static constants for now but we should be able to paginate here...

  const getTransactions = useCallback(async (id: string) => {
    setTransactionFetchError(undefined);

    try {
      const response = await fetch(
        `http://localhost:3000/points/transactions/${id}?page=${currentPage}&page_size=${pageSize}`
      );
      if (!response.ok) {
        throw new Error(await response.json().then(data => data.error_message));
      }
      const data: [Transaction] = await response.json();
      setTransactions(data);
    } catch (e: any) {
      setTransactionFetchError(e.message);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getTransactions(userId);
    }
  }, [userId, getTransactions]);

  return { transactions, getTransactions, transactionFetchError };
}
