import { Component, OnInit } from '@angular/core';
import { vehicleService } from 'src/app/services/vehicle.service';

@Component({
    selector: 'app-vehicle-form',
    templateUrl: './vehicle-form.component.html',
    styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
    makes;
    models: any[];
    vehicle: any = {};
    features;

    constructor(
        private vehicleService: vehicleService, 
    ) { }

    ngOnInit() {
        this.vehicleService.getMakes().subscribe(makes =>
            this.makes = makes
        );

        this.vehicleService.getFeatures().subscribe(features =>{ 
            this.features = features;
        });
    }

    onMakeChange(){
        var selectedMake = this.makes.find(m => m.id == this.vehicle.make);
        this.models = selectedMake ? selectedMake.models : [];
    }
}
