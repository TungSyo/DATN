import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable()
export class NodeService {
    constructor(private http: HttpClient) {}

    // getFiles() {
    //     return this.http
    //         .get<any>('assets/demo/data/files.json')
    //         .toPromise()
    //         .then((res) => res.data as TreeNode[]);
    // }

    getFiles() {
        return Promise.resolve([
            {
                key: '0',
                label: 'Documents',
                data: 'Documents Folder',
                children: [
                    {
                        key: '0-0',
                        label: 'Work',
                        data: 'Work Folder',
                        children: [
                            {
                                key: '0-0-0',
                                label: 'Expenses.doc',
                                data: 'Expenses Document',
                            },
                            {
                                key: '0-0-1',
                                label: 'Resume.doc',
                                data: 'Resume Document',
                            },
                        ],
                    },
                    {
                        key: '0-1',
                        label: 'Home',
                        data: 'Home Folder',
                        children: [
                            {
                                key: '0-1-0',
                                label: 'Invoices.txt',
                                data: 'Invoices for this month',
                            },
                        ],
                    },
                ],
            },
            {
                key: '1',
                label: 'Pictures',
                data: 'Pictures Folder',
                children: [
                    {
                        key: '1-0',
                        label: 'barcelona.jpg',
                        data: 'Barcelona Photo',
                    },
                    { key: '1-1', label: 'primeui.png', data: 'PrimeUI Logo' },
                ],
            },
            {
                key: '2',
                label: 'Movies',
                data: 'Movies Folder',
                children: [
                    {
                        key: '2-0',
                        label: 'Al Pacino',
                        data: 'Pacino Movies',
                        children: [
                            {
                                key: '2-0-0',
                                label: 'Scarface',
                                data: 'Scarface Movie',
                            },
                            {
                                key: '2-0-1',
                                label: 'Serpico',
                                data: 'Serpico Movie',
                            },
                        ],
                    },
                    {
                        key: '2-1',
                        label: 'Robert De Niro',
                        data: 'De Niro Movies',
                        children: [
                            {
                                key: '2-1-0',
                                label: 'Goodfellas',
                                data: 'Goodfellas Movie',
                            },
                            {
                                key: '2-1-1',
                                label: 'Untouchables',
                                data: 'Untouchables Movie',
                            },
                        ],
                    },
                ],
            },
        ]);
    }

    getLazyFiles() {
        return this.http
            .get<any>('assets/demo/data/files-lazy.json')
            .toPromise()
            .then((res) => res.data as TreeNode[]);
    }

    getFilesystem() {
        return this.http
            .get<any>('assets/demo/data/filesystem.json')
            .toPromise()
            .then((res) => res.data as TreeNode[]);
    }

    getLazyFilesystem() {
        return this.http
            .get<any>('assets/demo/data/filesystem-lazy.json')
            .toPromise()
            .then((res) => res.data as TreeNode[]);
    }
}
