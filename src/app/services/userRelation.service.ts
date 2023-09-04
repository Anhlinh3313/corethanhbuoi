import { Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/components/common/messageservice";


@Injectable()
export class UserRelationService extends GeneralService {
  constructor(protected httpClient: HttpClient, protected messageService: MessageService) {
    super(httpClient, "userRelation", messageService);
  }

  getUserRelationByUser(userId?: any, pageSize?: any, pageNum?: any, cols?: string[]) {
    let params = new HttpParams();
    params = params.append("userId", userId);
    params = params.append("pageSize", pageSize);
    params = params.append("pageNum", pageNum);
    if (cols) params = params.append("cols", cols.join(','));
    return super.getCustomApi("GetUserRelationByUser", params);
  }
}