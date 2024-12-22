"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PaymentForm } from "@/components/payments/payment-form";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function PaymentPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout title="Pay with MedCoin">
      <div className="max-w-md mx-auto">
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-center text-xl font-semibold mb-2">
              Secure Medical Payments
            </h2>
            <p className="text-center text-muted-foreground">
              Pay for your consultations using MedCoin, our secure blockchain-based
              payment system.
            </p>
          </CardContent>
        </Card>

        <PaymentForm
          patientAddress={user.wallet_address}
          doctorAddress={user.doctor_wallet_address}
        />
      </div>
    </DashboardLayout>
  );
}