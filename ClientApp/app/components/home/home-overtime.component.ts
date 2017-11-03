import { Component } from "@angular/core";

@Component({
    selector: "home-overtime",
    templateUrl: "./home-overtime.component.html",
})
/** home-overtime component*/
export class HomeOvertimeComponent
{
    onOpenNewLink(link?: string): void {
        if (link) {
            window.open(link, "_blank");
        }
    }
}