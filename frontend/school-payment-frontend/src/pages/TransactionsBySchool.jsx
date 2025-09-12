import { useState } from "react";
import API from "../api/api";

// ShadCN UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

export default function TransactionsBySchool() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBySchool = async () => {
    if (!schoolId) {
      setError("⚠️ Please enter a school_id");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/transactions/school/${schoolId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching by school", err);
      setError("❌ Failed to fetch transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🎓 Transactions by School
      </h2>

      {/* Input & Button */}
      <div className="flex gap-3 mb-6">
        <Input
          type="text"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          placeholder="Enter school_id"
          className="w-full"
        />
        <Button onClick={fetchBySchool} disabled={loading}>
          {loading ? "Loading..." : "Fetch"}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Transactions List */}
      <div className="grid gap-4">
        {transactions.length > 0 ? (
          transactions.map((t, i) => (
            <Card key={t.collect_id || i}>
              <CardHeader>
                <CardTitle>
                  📦 Order: {t.custom_order_id || "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant={
                      t.status === "success"
                        ? "success"
                        : t.status === "pending"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {t.status}
                  </Badge>
                </p>
                <p className="mb-1">
                  <strong>Amount:</strong> ₹{t.transaction_amount || 0}
                </p>
                <p>
                  <strong>School ID:</strong> {t.school_id || "N/A"}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          !loading && (
            <Alert>
              <AlertTitle>ℹ️ Info</AlertTitle>
              <AlertDescription>
                No transactions found for this school
              </AlertDescription>
            </Alert>
          )
        )}
      </div>
    </div>
  );
}
