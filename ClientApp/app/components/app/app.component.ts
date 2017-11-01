import { Component, ViewEncapsulation, OnInit } from "@angular/core";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["../../styles/app.style.scss"],
    encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit {

    option: string;
    constructor() { }

    // called by Angular after main-screen component initialized */
    ngOnInit(): void {
        this.option = "";
    }

    SelectApp(option?: string): void {
        if (option) {
            // console.log("Option is:" , option);
            this.option = option;
        }
    }
}
