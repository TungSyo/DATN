import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-client-layout',
    templateUrl: './client-layout.component.html',
    styleUrls: ['./client-layout.component.css'],
})
export class ClientLayoutComponent implements OnInit {
    constructor(public router: Router) {}

    public isOpen = false;

    ngOnInit() {}

    isShowHeader() {
        // return !this.router.url.startsWith('/toeic/test-toeic');
        return !(
            this.router.url.startsWith('/user-information') ||
            this.router.url.startsWith('/register')
        );
    }
}
