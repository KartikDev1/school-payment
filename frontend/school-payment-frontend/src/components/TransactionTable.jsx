import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function TransactionsTable({
  transactions,
  page,
  sortField,
  sortOrder,
  onSort,
}) {
  const copyToClipboard = (id, label) => {
    navigator.clipboard.writeText(id);
    toast.success(`${label} copied!`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">Sr. No.</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>School ID</TableHead>
          <TableHead>Gateway</TableHead>
          <TableHead
            className="cursor-pointer select-none hover:bg-gray-100"
            onClick={() => onSort("order_amount")}
          >
            Order Amount{" "}
            {sortField === "order_amount"
              ? sortOrder === "asc"
                ? "⬆️"
                : "⬇️"
              : ""}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none hover:bg-gray-100"
            onClick={() => onSort("transaction_amount")}
          >
            Transaction Amount{" "}
            {sortField === "transaction_amount"
              ? sortOrder === "asc"
                ? "⬆️"
                : "⬇️"
              : ""}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Custom Order ID</TableHead>
          <TableHead
            className="cursor-pointer select-none hover:bg-gray-100"
            onClick={() => onSort("payment_time")}
          >
            Date & Time{" "}
            {sortField === "payment_time"
              ? sortOrder === "asc"
                ? "⬆️"
                : "⬇️"
              : ""}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((t, idx) => (
          <TableRow
            key={t.collect_id}
            className="transition-transform hover:scale-[1.01] hover:shadow-md"
          >
            {/* Sr. No. */}
            <TableCell>{(page - 1) * 10 + (idx + 1)}</TableCell>

            {/* Collect ID */}
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{t.collect_id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(t.collect_id, "Collect ID")}
                >
                  📋
                </Button>
              </div>
            </TableCell>

            {/* School ID */}
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{t.school_id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(t.school_id, "School ID")}
                >
                  📋
                </Button>
              </div>
            </TableCell>

            {/* Gateway */}
            <TableCell>{t.gateway}</TableCell>

            {/* Order Amount */}
            <TableCell>₹{t.order_amount}</TableCell>

            {/* Transaction Amount */}
            <TableCell>₹{t.transaction_amount}</TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  t.status === "success"
                    ? "bg-green-100 text-green-700"
                    : t.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {t.status}
              </span>
            </TableCell>

            {/* Custom Order ID */}
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{t.custom_order_id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(t.custom_order_id, "Custom Order ID")
                  }
                >
                  📋
                </Button>
              </div>
            </TableCell>

            {/* Date & Time */}
            <TableCell>{formatDate(t.payment_time || t.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
