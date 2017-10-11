﻿import {
    UnitsMeasure, CuttingPlan,
    JobCardMaster
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
    JobCardMaster?: JobCardMaster;
    UnitsMeasure?: UnitsMeasure;
    CuttingPlan?: CuttingPlan;
    //ViewModel
    UnitsMeasureString?: string;
    CuttingPlanString?: string;
    StandardTimeString?: string;
    FullNameString?: string;
    //ReadOnly
    StatusString?: string;
}