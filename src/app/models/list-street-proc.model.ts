export class ListStreetProcModel {
    id: number;
    code: string;
    name: string;
    provinceName?: string;
    provinceCode?: string;
    provinceId?: number;
    districtName?: string;
    districtCode?: string;
    districtId?: number;
    wardName?: string;
    wardCode?: string;
    wardId?: number;
    totalCount?: number;
    rowNum?: number;
}