import { ethers } from 'ethers';
import { supabase } from '@/lib/db/supabase';
import { APP_CONFIG } from '@/lib/constants/config';
import { AuditService } from '@/lib/security/audit-service';

const MEDCOIN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function payDoctor(address doctor)",
  "function setConsultationFee(uint256 fee)",
  "function consultationFees(address) view returns (uint256)",
  "event PaymentProcessed(address patient, address doctor, uint256 amount)"
];

export class MedCoinService {
  private static instance: MedCoinService;
  private contract: ethers.Contract;
  private provider: ethers.providers.JsonRpcProvider;

  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(APP_CONFIG.blockchain.rpcUrl);
    this.contract = new ethers.Contract(
      APP_CONFIG.blockchain.medcoinAddress,
      MEDCOIN_ABI,
      this.provider
    );
  }

  static getInstance(): MedCoinService {
    if (!MedCoinService.instance) {
      MedCoinService.instance = new MedCoinService();
    }
    return MedCoinService.instance;
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  async setConsultationFee(fee: number): Promise<void> {
    const signer = this.provider.getSigner();
    const tx = await this.contract.connect(signer).setConsultationFee(
      ethers.utils.parseEther(fee.toString())
    );
    await tx.wait();
  }

  async processPayment(doctorAddress: string, patientAddress: string): Promise<void> {
    try {
      const signer = this.provider.getSigner(patientAddress);
      const tx = await this.contract.connect(signer).payDoctor(doctorAddress);
      const receipt = await tx.wait();

      // Record payment in database
      const { error } = await supabase.from('payments').insert({
        doctor_address: doctorAddress,
        patient_address: patientAddress,
        amount: ethers.utils.formatEther(receipt.events[0].args.amount),
        transaction_hash: receipt.transactionHash,
        timestamp: new Date().toISOString()
      });

      if (error) throw error;

      // Log the payment event
      await AuditService.logSecurityEvent(doctorAddress, 'payment', {
        type: 'payment_received',
        patient: patientAddress,
        transaction_hash: receipt.transactionHash
      });
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  async getConsultationFee(doctorAddress: string): Promise<string> {
    const fee = await this.contract.consultationFees(doctorAddress);
    return ethers.utils.formatEther(fee);
  }
}