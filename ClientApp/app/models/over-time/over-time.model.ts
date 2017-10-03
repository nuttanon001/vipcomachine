export interface TaskMachineHasOverTime {
    OverTimeId: number;
    Description?: string;
    OverTimeStart?: Date;
    OverTimeEnd?: Date;
    OverTimePerDate?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    /** FK */
    TaskMachineId?: number;
}