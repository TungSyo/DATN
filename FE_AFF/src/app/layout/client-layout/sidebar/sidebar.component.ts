import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
    // menu-data.ts
    menuItems: any;
    activeSubmenu: any = null;
    constructor() {}

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Trang chủ',
                link: '/',
                children: [],
            },
            {
                label: 'Giới thiệu',
                isOpen: false,
                children: [
                    { label: 'Thư ngỏ', link: '/gioi-thieu/thu-ngo' },
                    {
                        label: 'Tầm nhìn sứ mệnh',
                        link: '/gioi-thieu/tam-nhin-su-menh',
                    },
                    {
                        label: 'Giá trị khác biệt',
                        link: '/gioi-thieu/gia-tri-khac-biet',
                    },
                ],
            },
            {
                label: 'Sản phẩm',
                link: '/san-pham',
                children: [
                    { label: 'Thư ngỏ', link: '/gioi-thieu/thu-ngo' },
                    {
                        label: 'Tầm nhìn sứ mệnh',
                        link: '/gioi-thieu/tam-nhin-su-menh',
                    },
                    {
                        label: 'Giá trị khác biệt',
                        link: '/gioi-thieu/gia-tri-khac-biet',
                    },
                ],
            },
            {
                label: 'Tin tức',
                link: '/tin-tuc',
                children: [],
            },
            {
                label: 'Điểm bán',
                link: '/diem-ban',
                children: [],
            },
            {
                label: 'Liên hệ',
                link: '/lien-he',
                children: [],
            },
        ];
    }

    toggleSubMenu(item: any, event: Event) {
        event.preventDefault();
        item.isOpen = !item.isOpen;
    }

    isSubmenuOpen(item: any): boolean {
        return item.isOpen;
    }
}
