"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils/date-formatter";
import { generatePDF } from "@/lib/utils/pdf-generator";
import { toast } from "@/lib/utils/toast";
import { BlockchainRecordService } from "@/lib/blockchain/record-service";

interface MedicalRecord {
  id: string;
  doctor_name: string;
  created_at: string;
  diagnosis: string;
  prescription?: string;
  blockchain_hash: string;
}

interface MedicalRecordsListProps {
  records: MedicalRecord[];
  isLoading: boolean;
}

export function MedicalRecordsList({ records, isLoading }: MedicalRecordsListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const blockchainService = BlockchainRecordService.getInstance();

  const handleDownload = async (record: MedicalRecord) => {
    try {
      setDownloadingId(record.id);

      // Verify record authenticity
      const verification = await blockchainService.verifyPatientRecord(record.id);
      if (!verification.valid) {
        toast({
          title: "Record Verification Failed",
          description: "This record may have been tampered with.",
          variant: "destructive"
        });
        return;
      }

      // Generate and download PDF
      await generatePDF({
        title: "Medical Record",
        doctor: record.doctor_name,
        date: formatDateTime(record.created_at),
        diagnosis: record.diagnosis,
        prescription: record.prescription,
        verificationHash: record.blockchain_hash
      });

      toast({
        title: "Download Complete",
        description: "Your medical record has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!records.length) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          No medical records found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Dr. {record.doctor_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(record.created_at)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(record)}
              disabled={downloadingId === record.id}
            >
              {downloadingId === record.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Diagnosis</h4>
              <p className="text-sm">{record.diagnosis}</p>
            </div>
            {record.prescription && (
              <div>
                <h4 className="font-medium mb-1">Prescription</h4>
                <p className="text-sm">{record.prescription}</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Blockchain Verification: {record.blockchain_hash}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}