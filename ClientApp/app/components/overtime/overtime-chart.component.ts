import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
// model
import { OptionChart } from "../../models/model.index";
// 3rd patry
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "overtime-chart",
    templateUrl: "./overtime-chart.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// overtime-chart component*/
export class OverTimeChartComponent {
    /** overtime-chart ctor */
    constructor() {

    }
}