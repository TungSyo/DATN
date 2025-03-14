import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
    selectedSection: string = 'Về Honivy'; // Mục mặc định
    constructor() {}

    ngOnInit(): void {}

    selectSection(section: string): void {
        this.selectedSection = section;
        console.log('Selected section:', this.selectedSection);
    }
}
