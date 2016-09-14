import { Directive, Renderer, ElementRef } from '@angular/core';

// Directive to apply green/red color to host content based on its value

@Directive({
    selector: '[sign]'
})
export class SignDirective {

    constructor(public renderer: Renderer, public elementRef: ElementRef) { }

    ngAfterViewChecked() {
        let text = this.elementRef.nativeElement.innerHTML;

        this.renderer.setElementStyle(this.elementRef.nativeElement, 'color', this.getColor(text));
    }

    getColor(txt) {
        if (!txt) return 'black'; //no text

        let numarr = txt.match(/[\d\.\-eE+]/g);
        if (!numarr) return 'black'; //no numbers in text

        let val = parseFloat(numarr.join(""));
        if (isNaN(val) || val == 0) return 'black'; //not a number or 0

        if (val < 0) {
            return 'red';
        }
        else {
            return 'green';
        }
    }
}
