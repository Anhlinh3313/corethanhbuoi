import { GeneralModel } from "../models/index";

export class HubRoutingCreateUpdateViewModel extends GeneralModel {
    hubId: number;
    userId: number;
    codeConnect: string;
    radiusServe: number;
    isTruckDelivery: boolean;
    wardIds: number[];
    streetJoinIds?: number[];
}