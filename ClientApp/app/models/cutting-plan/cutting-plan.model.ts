import { Material,ProjectCodeDetail } from "../model.index";

export interface CuttingPlan {
    CuttingPlanId: number;
    CuttingPlanNo?: string;
    Description?: string;
    TypeCuttingPlan?: number;
    Creator?: string;
    CreateDate?: Date;
    Modifyer?: string;
    ModifyDate?: Date;
    ProjectCodeDetailId?: number;
    //FK
    ProjectCodeDetail?: ProjectCodeDetail;
    //ViewModel
    ProjectCodeString?: string;
    TypeCuttingPlanString?: string;
}