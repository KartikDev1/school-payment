/* eslint-disable no-unused-vars */
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
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function TransactionStatus() {
  const [customId, setCustomId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!customId.trim()) {
      setError("⚠️ Please enter a valid custom_order_id");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/transaction-status/${customId}`);
      setStatus(res.data);
    } catch (err) {
      setError("❌ Failed to fetch transaction status");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Check Transaction Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Input + Button */}
          <div className="flex gap-3 mb-6">
            <Input
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="Enter custom_order_id"
            />
            <Button onClick={checkStatus} disabled={loading}>
              {loading ? "Checking..." : "Check"}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Status Display */}
          {status && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(status).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
