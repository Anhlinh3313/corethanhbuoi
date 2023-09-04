import { GeneralModel } from "./general.model";
import { Hub } from "./hub.model";
import { User } from "./user.model";

export class HubRouting extends GeneralModel {
    hubId: number;
    userId: number;
    codeConnect: string;
    radiusServe: number = 0;
    isTruckDelivery: boolean = false;
    hub: Hub;
    user: User;
}