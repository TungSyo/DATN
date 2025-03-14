import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { noWhitespaceValidator } from 'src/app/components/client/shared/validator';
import { AddressService } from 'src/app/core/services/address.service';
import { BankService } from 'src/app/core/services/bank.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrl: './create-order.component.scss',
})
export class CreateOrderComponent {
    showDialog = true;
    OrderGroupForm!: FormGroup;
    apiQR =
        'https://img.vietqr.io/image/vcb-9383716351-print.jpg?amount=10000&accountName=PHAM%20XUAN%20MANH&addInfo=ab2k1312';
    orderForm: FormGroup;
    isDropdownCity: boolean = false;
    isDropdownBank: boolean = false;
    isSubmitting: boolean = false;
    isSubmittingText: string = 'ĐẶT HÀNG';
    isDropdownDistrict: boolean = false;
    isDropdownWard: boolean = false;
    dataToSendOtp: any;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    banks: any[] = [];
    cart: any[] = [];
    totalAmount: any;
    cartItems: any[] = [];
    selectedCountryId!: number;
    selectedCityId!: number;
    selectedDistrictId!: number;
    selectedWardId!: number;

    constructor(
        private formBuilder: FormBuilder,
        private addressService: AddressService,
        private orderService: OrderService,
        private router: Router,
        private bankService: BankService,
        private messageService: MessageService
    ) {
        this.OrderGroupForm = this.formBuilder.group({
            name: [null, [Validators.required, noWhitespaceValidator()]],
            phoneNumber: [null, [Validators.required, noWhitespaceValidator()]],
            cityId: [null],
            cityName: [null],
            districtId: [null],
            districtName: [null],
            wardId: [null],
            wardName: [null],
            // address: [null],
            // note: [null],
            // paymentAccountReceiptId: [],
            // paymentAccountReceiptName: [null, Validators.required],
            // paymentMethod: [0],
        });
    }
    ngOnInit() {
        this.getCitiesByCountry(1);
        console.log("city init",this.cities)
    }
    OrderSubmit() {}
    getCitiesByCountry(countryId: number) {
        this.addressService
            .getCitiesByIdCountry({ id: countryId })
            .subscribe((cities) => {
              console.log('cities',cities)
                this.cities = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCity(cityId: number) {
        this.addressService
            .getDistrictsByIdCity({ cityId: cityId })
            .subscribe((districts) => {
                this.districts = districts.data;
            });
    }

    getWardsByDistrict(districtId: number) {
        this.addressService
            .getWardsByIdDistrict({ districtId: districtId })
            .subscribe((wards) => {
                this.wards = wards.data;
            });
    }

    onCountryChange(countryId: number) {
        this.selectedCountryId = countryId;
        this.getCitiesByCountry(countryId);
        this.districts = [];
        this.wards = [];
    }

    onCityChange(cityId: number) {
        this.selectedCityId = cityId;
        this.getDistrictsByCity(cityId);
        this.districts = [];
        this.wards = [];
        this.OrderGroupForm.get('wardId')?.setValue(null);
        this.OrderGroupForm.get('districtId')?.setValue(null);
    }

    onDistrictChange(districtId: number) {
        this.selectedDistrictId = districtId;
        this.getWardsByDistrict(districtId);
        this.wards = [];
        this.OrderGroupForm.get('wardId')?.setValue(null);
    }

    onClearCity() {
        this.OrderGroupForm.get('wardId')?.setValue(null);
        this.OrderGroupForm.get('districtId')?.setValue(null);
    }

    onClearDistrict() {
        this.OrderGroupForm.get('wardId')?.setValue(null);
    }

    onClearWard() {
        this.OrderGroupForm.get('wardId')?.setValue(null);
    }
    closeDialog() {
        this.showDialog = false;
    }
}
