//angular
import { Component, OnInit, ViewContainerRef, ViewChild } from "@angular/core";
// model
import { CuttingImport } from "../../models/model.index";
//services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { CuttingPlanService } from "../../services/cutting-plan/cutting-plan.service";

@Component({
    selector: "import-csv",
    templateUrl: "./import-csv.component.html",
    styleUrls: [
        "../../styles/edit.style.scss",
        "../../styles/master.style.scss"
    ],
})

/** import-csv component*/
export class ImportCsvComponent implements OnInit
{
    @ViewChild("inputFile") inputFile: any;
    //textCsv: Array<any>;
    textHeader: Array<string>;
    importDatas: Array<CuttingImport>;
    /** import-csv ctor */
    constructor(
        private serviceDialogs: DialogsService,
        private viewContainerRef: ViewContainerRef,
    ) { }

    /** Called by Angular after import-csv component initialized */
    ngOnInit(): void {
        //this.textCsv = new Array;
        this.textHeader = new Array;
        this.importDatas = new Array;
    }

    // on file change
    onFileChange(event: any) {
        let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];

        //debug here
        // console.log("File: ", file.type);

        let pattern = /vnd.ms-excel/;
        if (!file.type.match(pattern)) {
            this.inputFile.nativeElement.value = "";
            this.serviceDialogs.error("ไม่เข้าเงื่อนไข", "ระบบบันทึกเฉพาะไฟล์ \"CSV.\" เท่านั้น !!!", this.viewContainerRef)
            return;
        } else {
            // FileReader
            let reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = (e) => {
                this.extractData(reader.result);
            }
            //reader.onload = function (event_) {
            //    var csv = event_.target.result; // Content of CSV file
            //    this.extractData(csv); //Here you can call the above function.
            //};
        }
    }

    // extract Data
    // Input csv data to the function
    extractData(data:any) {
        let allTextLines = data.split(/\r\n|\n/);
        let headers: Array<string> = allTextLines[0].split(',');
        // trim
        headers.forEach((value) => {
            value = value.trim();
        });
        this.textHeader = headers.slice();
        // debug here
        // console.log("Header: ", this.textHeader);
        // all text line
        let lines:Array<CuttingImport> = new Array;
        // for loop string
        // skip row 0 is header
        for (let i = 1; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(',');
            // console.log("Data: ", data);
            if (data.length == headers.length) {
                //let line = [];
                let row: CuttingImport = {};
                for (let j = 0; j < headers.length; j++) {
                    //line.push(data[j].trim());

                    if (headers[j].toLowerCase().includes("jobnumber")) {
                        row.JobNo = data[j].trim();
                    } else if (headers[j].toLowerCase().includes("namelevel")) {
                        row.Level23 = data[j].trim();
                    } else if (headers[j].toLowerCase().includes("cuttingplan")) {
                        row.CuttingPlan = data[j].trim();
                    } else if (headers[j].toLowerCase().includes("materialsize")) {
                        row.MaterialSize = data[j].trim();
                    } else if (headers[j].toLowerCase().includes("materialgrade")) {
                        row.MaterialGrade = data[j].trim();
                    } else if (headers[j].toLowerCase().includes("quantity")) {
                        row.Quantity = data[j].trim();
                    }
                }
                lines.push(row);
            }
        }
        //this.textCsv = lines.slice(); //The data in the form of 2 dimensional array.
        if (lines.length) {
            this.importDatas = lines.slice();
        } else {
            this.serviceDialogs.error("ไม่พบข้อมูล", "ระบบตรวจไม่พบข้อมูลเพื่อนำเข้าระบบ โปรดตรวจสอบไฟล์แล้วทำการลองใหม่ !!!", this.viewContainerRef)
            this.importDatas = new Array;
        }
    }
    // on down load csvfile
    onOpenDownLoadFormatFile(link: string): void {
        if (link)
            window.open(link, '_blank');
    }
    // Clear Data
    onClearData() {
        //this.textCsv = new Array;
        this.textHeader = new Array;
        this.importDatas = new Array;
    }
}