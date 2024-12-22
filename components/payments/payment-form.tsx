"use client";

import { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Loader2 } from "lucide-react";
import { MedCoinService } from '@/lib/blockchain/medcoin-service';
import { toast } from '@/lib/utils/toast';

interface PaymentFormProps {
  doctorAddress: string;
  patientAddress: string;
}

export function PaymentForm({ doctorAddress, patientAddress }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [fee, setFee] = useState<string>('0');
  const medcoinService = MedCoinService.getInstance();

  const loadData = async () => {
    try {
      const [balanceAmount, feeAmount] = await Promise.all([
        medcoinService.getBalance(patientAddress),
        medcoinService.getConsultationFee(doctorAddress)
      ]);
      setBalance(balanceAmount);
      setFee(feeAmount);
    } catch (error) {
      toast({
        title: "Failed to load payment data",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      await medcoinService.processPayment(doctorAddress, patientAddress);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed"
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Pay with MedCoin</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Your Balance</Label>
          <div className="text-2xl font-bold">{balance} MEDC</div>
        </div>

        <div className="space-y-2">
          <Label>Consultation Fee</Label>
          <div className="text-2xl font-bold">{fee} MEDC</div>
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={isProcessing || Number(balance) < Number(fee)}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Pay Now
            </>
          )}
        </Button>

        {Number(balance) < Number(fee) && (
          <p className="text-sm text-destructive">
            Insufficient balance. Please add more MedCoin to your wallet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}