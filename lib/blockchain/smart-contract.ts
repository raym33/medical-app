import { ethers } from 'ethers';
import { APP_CONFIG } from '@/lib/constants/config';

const MEDICAL_RECORDS_ABI = [
  "event RecordUpdated(bytes32 indexed recordHash, address indexed doctor, uint256 timestamp)",
  "function addRecord(bytes32 recordHash, bytes32 encryptedDataHash) public",
  "function verifyRecord(bytes32 recordHash, bytes32 encryptedDataHash) public view returns (bool)",
];

export class MedicalRecordsContract {
  private static instance: MedicalRecordsContract;
  private contract: ethers.Contract;
  private provider: ethers.providers.JsonRpcProvider;

  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(APP_CONFIG.blockchain.rpcUrl);
    this.contract = new ethers.Contract(
      APP_CONFIG.blockchain.contractAddress,
      MEDICAL_RECORDS_ABI,
      this.provider
    );
  }

  static getInstance(): MedicalRecordsContract {
    if (!MedicalRecordsContract.instance) {
      MedicalRecordsContract.instance = new MedicalRecordsContract();
    }
    return MedicalRecordsContract.instance;
  }

  async addRecord(recordData: any): Promise<string> {
    const recordHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(recordData))
    );
    
    const signer = this.provider.getSigner();
    const tx = await this.contract.connect(signer).addRecord(recordHash);
    await tx.wait();
    
    return recordHash;
  }

  async verifyRecord(recordData: any, storedHash: string): Promise<boolean> {
    const computedHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(recordData))
    );
    return await this.contract.verifyRecord(computedHash, storedHash);
  }
}