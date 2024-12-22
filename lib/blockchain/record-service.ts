import { supabase } from '@/lib/db/supabase';
import { MedicalRecordsContract } from './smart-contract';
import { EncryptionService } from '@/lib/security/encryption';
import { AuditService } from '@/lib/security/audit-service';

export class BlockchainRecordService {
  private static instance: BlockchainRecordService;
  private contract: MedicalRecordsContract;
  private encryption: EncryptionService;

  private constructor() {
    this.contract = MedicalRecordsContract.getInstance();
    this.encryption = EncryptionService.getInstance();
  }

  static getInstance(): BlockchainRecordService {
    if (!BlockchainRecordService.instance) {
      BlockchainRecordService.instance = new BlockchainRecordService();
    }
    return BlockchainRecordService.instance;
  }

  async savePatientRecord(
    patientId: string,
    doctorId: string,
    recordData: any
  ): Promise<void> {
    try {
      // Encrypt the record data
      const encryptedData = this.encryption.encryptObject(recordData);
      
      // Add record to blockchain
      const blockchainHash = await this.contract.addRecord(recordData);
      
      // Store in Supabase with blockchain reference
      const { error } = await supabase.from('patient_records').insert({
        patient_id: patientId,
        doctor_id: doctorId,
        encrypted_data: encryptedData,
        blockchain_hash: blockchainHash,
        blockchain_timestamp: new Date().toISOString()
      });

      if (error) throw error;

      // Log the audit event
      await AuditService.logSecurityEvent(doctorId, 'data_access', {
        action: 'create_record',
        patient_id: patientId,
        blockchain_hash: blockchainHash
      });
    } catch (error) {
      console.error('Failed to save patient record:', error);
      throw error;
    }
  }

  async verifyPatientRecord(recordId: string): Promise<{
    valid: boolean;
    verificationDetails?: any;
  }> {
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select('*')
        .eq('id', recordId)
        .single();

      if (error) throw error;

      const decryptedData = this.encryption.decryptObject(data.encrypted_data);
      const isValid = await this.contract.verifyRecord(
        decryptedData,
        data.blockchain_hash
      );

      return {
        valid: isValid,
        verificationDetails: {
          timestamp: data.blockchain_timestamp,
          hash: data.blockchain_hash
        }
      };
    } catch (error) {
      console.error('Failed to verify patient record:', error);
      return { valid: false };
    }
  }
}