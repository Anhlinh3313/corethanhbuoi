import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { GeneralService } from './general.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectModel } from '../models/select.model';
import { HubRouting } from '../models/hubRouting.model';
import { TransferRouting } from '../models';

@Injectable()
export class TransferRoutingService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "transferRouting", messageService);
  }

  public async getSelectModelAllAsync(): Promise<SelectModel[]> {
    const res = await this.getAllAsync();
    const data: SelectModel[] = [];
    data.push({ label: "-- Chọn tuyến trung chuyển --", value: null });
    if (res) {
      res.forEach(element => {
        data.push({ label: element.name, value: element.id, data: element });
      });
      return data;
    } else {
      return null;
    }
  }
  getTransferRouting(code?: any) {
    let params = new HttpParams();
    params = params.append("code", code);
    return super.getCustomApi("getTransferRoutingByCode", params);
  }
  async getTransferRoutingByCodeAsync(code?: any): Promise<TransferRouting> {
    const res = await this.getTransferRouting(code).toPromise();
    if (!this.isValidResponse(res)) return;
    const data = res.data as TransferRouting;
    return data;
  }
}