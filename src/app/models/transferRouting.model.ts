import { GeneralModel } from "./general.model";
import { Hub } from "./hub.model";

export class TransferRouting extends GeneralModel {
    fromHubId: number;
    toHubId: number;
    fromHub: Hub;
    toHub: Hub;
}