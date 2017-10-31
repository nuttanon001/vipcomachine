export interface OverTimeDetail {
    OverTimeDetailId: number;
    TotalHour: number;
    Remark?: string;
    OverTimeDetailStatus?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    //FK
    // OverTimeMaster
    OverTimeMasterId?: number;
    // Employee
    EmpCode?: string;
    // ViewModel
    EmployeeString?: string;

    [key: string]: string | number | Date | undefined;
}