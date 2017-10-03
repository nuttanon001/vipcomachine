import { Component, forwardRef, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaExpanded2Component),
    multi: true,
};

@Component({
    selector: 'textarea-expanded2',
    providers: [EPANDED_TEXTAREA_VALUE_ACCESSOR],
    template: `

    <input contenteditable="true" mdInput placeholder="Test" (change)="change($event)" role="textarea" #textarea>
  `,
    styles: [`
    div {
      width: 200px;
      min-height: 50px;
      border: 1px solid lightgray;
    }
    div.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }
  `]
})
export class TextareaExpanded2Component implements ControlValueAccessor {
    @ViewChild('textarea') textarea: any;

    onChange: any;
    onTouched: any;

    writeValue(value: any): void {
        const div = this.textarea.nativeElement;
        this.renderer.setProperty(div, 'textContent', value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        const div = this.textarea.nativeElement;
        const action = isDisabled ? 'addClass' : 'removeClass';
        this.renderer[action](div, 'disabled');
    }

    constructor(private renderer: Renderer2) {
    }

    change($event: any) {
        this.onChange($event.target.textContent);
        this.onTouched($event.target.textContent);
    }
}