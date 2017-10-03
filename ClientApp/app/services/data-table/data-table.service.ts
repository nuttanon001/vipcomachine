import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
// model
import { PageData,Page,Scroll,ScrollData } from "../../models/model.index";

@Injectable()
export class DataTableServiceCommunicate<Model> {
    // Observable string sources
    private ParentSource = new Subject<Scroll>();
    private ChileSource = new Subject<ScrollData<Model>>();

    // Observable string streams
    ToParent$ = this.ParentSource.asObservable();
    toChild$ = this.ChileSource.asObservable();

    // Service message commands
    toParent(scroll: Scroll): void {
        this.ParentSource.next(scroll);
    }

    toChild(scrollData: ScrollData<Model>): void {
        this.ChileSource.next(scrollData);
    }
}