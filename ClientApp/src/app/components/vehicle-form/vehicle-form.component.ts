import { SaveVehicle, Vehicle } from './../../models/vehicle';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { vehicleService } from 'src/app/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-vehicle-form',
    templateUrl: './vehicle-form.component.html',
    styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
    makes;
    models: any[];
    vehicle: SaveVehicle = {
        id: 0,
        makeId: 0,
        modelId: 0,
        isRegistered: null,
        features:[],
        contact: {
            name: '',
            email: '',
            phone: ''
        }
    };
    features;

    constructor(
        private toastrService : ToastrService,
        private route : ActivatedRoute,
        private router : Router,
        private vehicleService : vehicleService)
    {
        route.params.subscribe(p => {
            this.vehicle.id = +p['id'];
        });
    }

    ngOnInit() {
        var soucers = [
            this.vehicleService.getMakes(),
            this.vehicleService.getFeatures()
        ];

        if(this.vehicle.id)
            soucers.push(this.vehicleService.getVehicle(this.vehicle.id));

        forkJoin(soucers).subscribe(
            data => {
                this.makes = data[0];
                this.features = data[1];

                if(this.vehicle.id){
                    this.setVehicle(<Vehicle>data[2]);
                    this.populateModels();
                }

            },
            err => {
                if(err.status == 404)
                    this.router.navigate(['/']);
            }
        );
    }

    private setVehicle(v: Vehicle){
        this.vehicle.id = v.id;
        this.vehicle.makeId = v.make.id;
        this.vehicle.modelId = v.model.id;
        this.vehicle.isRegistered = v.isRegistered;
        this.vehicle.contact = v.contact;
        this.vehicle.features = v.features.map(f => f.id);
    }

    onMakeChange(){
        this.populateModels();
        delete this.vehicle.modelId;
    }

    private populateModels(){
        var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
        this.models = selectedMake ? selectedMake.models : [];
    }

    onFeatureChange(featureId, $event){
        if($event.target.checked)
            this.vehicle.features.push(featureId);
        else
            this.vehicle.features.splice(this.vehicle.features.indexOf(featureId));
    }

    submit(){

        if(this.vehicle.id){
            this.vehicleService.update(this.vehicle)
            .subscribe(x => this.toastrService.success('The vehicle was sucessfully updated.','Success'));
        }else{
            this.vehicleService.create(this.vehicle)
            .subscribe(x => console.log(x));
        }
    }

    delete(){
        if(confirm("Are you sure?")){
            this.vehicleService.delete(this.vehicle.id)
                .subscribe(x => this.router.navigate(['/']));
        }
    }
}
