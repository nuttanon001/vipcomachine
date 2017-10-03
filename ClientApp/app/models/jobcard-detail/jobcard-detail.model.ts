﻿import {
    UnitsMeasure,CuttingPlan
} from "../model.index";

export interface JobCardDetail {
    JobCardDetailId: number;
    Material?: string;
    Quality?: number;
    JobCardDetailStatus?: number;
    Remark?: string;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    // Fk
    JobCardMasterId?: number;
    UnitMeasureId?: number;
    StandardTimeId?: number;
    CuttingPlanId?: number;
    // Model
    UnitsMeasure?: UnitsMeasure;
    CuttingPlan?: CuttingPlan;
    //ViewModel
    UnitsMeasureString?: string;
    CuttingPlanString?: string;
    StandardTimeString?: string;
    //ReadOnly
    StatusString?: string;
}