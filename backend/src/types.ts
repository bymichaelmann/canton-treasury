export interface TreasuryBill {
  id: string;
  issuer: string;
  owner: string;
  amount: number;
  maturityDate: string;
  coupon: number;
  cusip: string;
  createdAt: string;
}

export interface MintRequest {
  issuer: string;
  owner: string;
  amount: number;
  maturityDate: string;
  coupon: number;
  cusip: string;
}

export interface TransferRequest {
  contractId: string;
  newOwner: string;
  restrictionCid: string;
}

export interface SplitRequest {
  contractId: string;
  splitAmount: number;
}

export interface InvestorRecord {
  id: string;
  officer: string;
  investor: string;
  name: string;
  jurisdiction: string;
  accreditation: AccreditationLevel;
  kycStatus: KYCStatus;
  registeredAt: string;
}

export type AccreditationLevel =
  | "AccreditedInvestor"
  | "QualifiedInstitutionalBuyer"
  | "RetailInvestor";

export type KYCStatus = "Pending" | "Approved" | "Rejected" | "Expired";

export interface RegisterInvestorRequest {
  officer: string;
  investor: string;
  name: string;
  jurisdiction: string;
}

export interface ApproveKYCRequest {
  officer: string;
  contractId: string;
}

export interface DataRoomDocument {
  id: string;
  issuer: string;
  documentId: string;
  title: string;
  description: string;
  ipfsHash: string;
  isConfidential: boolean;
  createdAt: string;
}

export interface CreateDocumentRequest {
  issuer: string;
  documentId: string;
  title: string;
  description: string;
  ipfsHash: string;
  isConfidential: boolean;
}

export interface GrantAccessRequest {
  issuer: string;
  documentCid: string;
  investor: string;
}
