import { PhotoService } from './../../services/photo.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { vehicleService } from './../../services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-vechicle-view',
    templateUrl: './vechicle-view.component.html',
    styleUrls: ['./vechicle-view.component.css']
})
export class VechicleViewComponent implements OnInit {
    vehicle: any;
    vehicleId: number;
    photos: any[];
    file: any = {
        progress: null,
        class: 'bg-danger',
        name: 'Choose photo',
    };
    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private vehicleService: vehicleService,
        private photoService: PhotoService) {
        route.params.subscribe(p => {
            this.vehicleId = +p['id'];
            if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
                router.navigate(['/vehicles']);
                return;
            }
        });
    }

    ngOnInit() {
        this.vehicleService.getVehicle(this.vehicleId)
            .subscribe(
                v => this.vehicle = v,
                err => {
                    if (err.status == 404) {
                        this.router.navigate(['/vehicles']);
                        return;
                    }
                });
        this.photoService.getPhotos(this.vehicleId)
            .subscribe((photos: any) => this.photos = photos);
    }

    delete() {
        if (confirm("Are you sure?")) {
            this.vehicleService.delete(this.vehicle.id)
                .subscribe(x => {
                    this.router.navigate(['/vehicles']);
                });
        }
    }

    uploadPhoto() {
        var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
        this.file.name = nativeElement.files[0]['name'];
        this.file.progress = 0;

        this.photoService.upload(this.vehicleId, nativeElement.files[0])
            .subscribe(
              res => {
                if(res && res.atualiza)
                    this.updateFileStatus(res.progresso);

                if (res.objeto !== null && res.objeto !== {})
                    this.photos.push(res);
            },
            err => this.toastrService.error(err.error, 'Error'),
            () => {
                this.file.progress = null,
                    this.file.name = 'Choose photo';
            });
    }

    private updateFileStatus(res) {
        this.file.progress = res;
        if (res < 25)
            this.file.class = 'bg-danger';
        else if (res < 50)
            this.file.class = 'bg-warning';
        else if (res < 75)
            this.file.class = 'bg-info';
        else
            this.file.class = 'bg-success';
    }
}
