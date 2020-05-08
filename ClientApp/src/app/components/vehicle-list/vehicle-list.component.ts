import { KeyValuePair } from './../../models/vehicle';
import { vehicleService } from 'src/app/services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';

@Component({
    selector: 'app-vehicle-list',
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
    private readonly PAGE_SIZE = 3;

    queryResult : any = {};
    makes : KeyValuePair[];
    query : any = {
        pageSize: this.PAGE_SIZE
    };
    columns = [
        {title: 'Id'},
        {title: 'Make', key: 'make', isSortable: true},
        {title: 'Model', key: 'model', isSortable: true},
        {title: 'Contact Name', key: 'contactName', isSortable: true},
        { },
    ]

    constructor(private vehicleService: vehicleService) { }

    ngOnInit() {

        this.vehicleService.getMakes()
            .subscribe(makes => this.makes = makes as KeyValuePair[]);
        this.populateVehicles();

    }

    private populateVehicles() {
        this.vehicleService.getVehicles(this.query)
        .subscribe(result => this.queryResult = result);
    }

    onFilterChange(){
        this.query.page = 1;
        this.populateVehicles();
    }

    resetFilter() {
        this.query = {
            page: 1,
            pageSize: this.PAGE_SIZE
        };
        this.onFilterChange();
    }

    sortBy(columnName){

        if(this.query.sortBy === columnName){
            this.query.isSortAscending = !this.query.isSortAscending;
        }else{
            this.query.sortBy = columnName;
            this.query.isSortAscending = false;
        }

        this.populateVehicles();
    }

    onPageChange(page){
        this.query.page = page;
        this.populateVehicles();
    }
}
