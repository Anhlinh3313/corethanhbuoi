import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import * as moment from "moment";
export class ExportExcelHelper {
    static s2ab(s: string): ArrayBuffer {
        const buf: ArrayBuffer = new ArrayBuffer(s.length);
        const view: Uint8Array = new Uint8Array(buf);
        //for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i);
        return buf;
    }

    static format(value: any, typeFormat: string, formatString: string) {
        if (!value) {
            return "";
        }
        if (typeFormat) {
            if (typeFormat === "date") {
                if (formatString) {
                    return moment(value).format(formatString);
                }
            }
        }
        return value;
    }

    static mapDataToExport(datas: any[], columns: any[]) {
        let exportData: any[] = [];
        if (!datas || !columns) return exportData;
        let header: any[] = [];
        columns.map(x => header.push(x.header));
        exportData.push(header);
        datas.map(x => {
            let row: any[] = [];
            let b: any;
            columns.forEach(element => {
                if (!element.field2) {
                    b = x[element.field];
                } else {
                    b = x[element.field2] ? (x[element.field] + " - " + x[element.field2]) : (x[element.field] + " -");
                }
                if (element.child) {
                    if (x[element.field]) {
                        if (element.childName) b = b[element.childName];
                        else b = b["name"];
                    }
                    if (!b && b != 0) b = "";
                    row.push(b);
                } else {
                    if (!b && b != 0) b = "";
                    row.push(this.format(b,element.typeFormat,element.formatString));
                }
            });
            exportData.push(row);
        });
        return exportData;
    }

    static exportXLSX(data: any, fileName: string, typeExport?: string) {
        let wopts: XLSX.WritingOptions;
        if (!typeExport || typeExport === "xlsx") {
            wopts = { bookType: "xlsx", type: "binary" };
            if (fileName.indexOf(".xlsx") === -1) {
                fileName = fileName + ".xlsx";
            }
        } else if (typeExport === "csv") {
            wopts = { bookType: "csv", type: "binary" };
            if (fileName.indexOf(".csv") === -1) {
                fileName = fileName + ".csv";
            }
        }
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout: string = XLSX.write(wb, wopts);
        saveAs(new Blob([this.s2ab(wbout)]), fileName);
    }
}