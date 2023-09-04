
import { GeneralModel } from "./general.model";
export class Shift extends GeneralModel {
    startTime : Date;
    endTime : Date;
    createdBy: any = null;
    createdWhen: any = null;
    modifiedBy: any = null;
    modifiedWhen: any = null;
    hourStartTime :  number;
    hourEndTime :  number;
    minuteStartTime : number;
    minuteEndTime : number;
    isToDate: boolean;
}
