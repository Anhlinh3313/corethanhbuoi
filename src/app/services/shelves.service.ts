import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

import { Ward } from '../models/ward.model';
import { ResponseModel } from '../models/response.model';
import { BaseModel } from '../models/base.model';
import { GeneralService } from './general.service';
import { HttpParams } from '@angular/common/http';
import { IdViewModel } from '../view-model/index';
import { StreetJoin } from '../models/streetJoin.model';
import { CreateStreet } from '../models/createStreet.model';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class ShelvesService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "Shelves", messageService);
  }
  public getByHubId( id : any,arrCols: string[] = [],): Observable<ResponseModel> {
    let params = new HttpParams();
    let cols = null;

    if (arrCols.length > 0) {
        cols = arrCols.join(',');
    }
    if (id)
        params = params.append("hubId", id);
    if (cols)
        params = params.append("cols", cols);

    return this.getCustomApi(`GetShelvesByHubId`, params );
    
}
}
