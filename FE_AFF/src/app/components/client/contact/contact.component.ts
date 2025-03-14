import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
    openGoogleMaps() {
        const googleMapsUrl = `https://www.google.com/maps/place/300+Ph%E1%BB%91+Cu%E1%BB%91i,+Ph%C6%B0%C6%A1ng+Hung,+Gia+L%E1%BB%99c,+H%E1%BA%A3i+D%C6%B0%C6%A1ng+170000,+Vietnam/@20.870932,106.305996,1505m/data=!3m1!1e3!4m6!3m5!1s0x31359078a7eb630f:0x94553d4d06d3e09c!8m2!3d20.8709323!4d106.3059962!16s%2Fg%2F11pvst_wbh?hl=en&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D`;
        window.open(googleMapsUrl, '_blank');
    }
}
