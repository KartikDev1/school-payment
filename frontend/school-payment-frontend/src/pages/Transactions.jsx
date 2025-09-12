import { useEffect, useState, useCallback } from "react";
import API from "../api/api";

// ShadCN UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import TransactionsTable from "@/components/TransactionTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilters, setStatusFilters] = useState("all"); // ✅ default = "all"
  const [collectId, setCollectId] = useState("");
  const [sortField, setSortField] = useState("payment_time"); // ✅ default sort by date
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactionsAsync = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10, sortField, sortOrder };

      if (statusFilters !== "all") params.status = statusFilters; // ✅ only add if not "all"
      if (collectId.trim()) params.collect_id = collectId.trim();

      const res = await API.get("/transactions/", { params });
      setTransactions(res.data.data || []);
      setTotalPages(
        res.data.totalPages || Math.ceil(res.data.totalCount / 10) || 1
      );
    } catch (err) {
      console.error("Error fetching transactions", err);
      setError("Failed to fetch transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilters, collectId, sortField, sortOrder]);

  useEffect(() => {
    fetchTransactionsAsync();
  }, [fetchTransactionsAsync]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Transactions Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            {/* Search by Collect ID */}
            <Input
              placeholder="Search by Collect ID..."
              value={collectId}
              onChange={(e) => {
                setCollectId(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-1/3"
            />

            {/* Status Dropdown (Single Select) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {statusFilters === "all"
                    ? "Status: All"
                    : `Status: ${statusFilters}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuRadioGroup
                  value={statusFilters}
                  onValueChange={(value) => {
                    setStatusFilters(value);
                    setPage(1);
                  }}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="success">
                    Success
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="pending">
                    Pending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="failed">
                    Failed
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          {loading ? (
            <p>Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-4">No transactions found</p>
          ) : (
            <TransactionsTable
              transactions={transactions}
              page={page}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
