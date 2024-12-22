import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFData {
  title: string;
  doctor: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  verificationHash: string;
}

export async function generatePDF(data: PDFData): Promise<void> {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text(data.title, 20, 20);
  
  // Add metadata
  doc.setFontSize(12);
  doc.text(`Doctor: ${data.doctor}`, 20, 40);
  doc.text(`Date: ${data.date}`, 20, 50);
  
  // Add diagnosis
  doc.setFontSize(14);
  doc.text('Diagnosis', 20, 70);
  doc.setFontSize(12);
  doc.text(data.diagnosis, 20, 80);
  
  // Add prescription if available
  let yPos = 100;
  if (data.prescription) {
    doc.setFontSize(14);
    doc.text('Prescription', 20, yPos);
    doc.setFontSize(12);
    doc.text(data.prescription, 20, yPos + 10);
    yPos += 30;
  }
  
  // Add verification info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Blockchain Verification Hash:', 20, yPos);
  doc.text(data.verificationHash, 20, yPos + 5);
  
  // Download the PDF
  doc.save('medical-record.pdf');
}