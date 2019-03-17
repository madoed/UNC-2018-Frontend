import { FnsItem } from './fns-item.model';

export interface FnsReceipt {
    fiscalDriveNumber: string;
    userInn : string;
    requestNumber: number;
    fiscalSign: number;
    dateTime: string;
    ecashTotalSum: number;
    items: FnsItem[];
    cashTotalSum: number;
    totalSum: number;
    operator: string;
    nds10: number;
    receiptCode: number;
    shiftNumber: number;
    nds18: number;
    fiscalDocumentNumber: number;
    operationType: number;
    kktRegId: string;
    rawData: string;
    taxationType: number;
}