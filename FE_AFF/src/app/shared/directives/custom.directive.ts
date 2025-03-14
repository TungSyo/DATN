import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appCustomDirective]',
})
export class CustomDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.renderer.setStyle(this.el.nativeElement, 'color', 'blue'); // Đổi màu chữ thành màu xanh
    }
}
