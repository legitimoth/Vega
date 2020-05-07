import { ErrorHandler, Inject, isDevMode } from "@angular/core";
import { ToastrService } from "ngx-toastr";

export class AppErrorHandler implements ErrorHandler {

    constructor(@Inject(ToastrService) private toastrService : ToastrService){}

    handleError(error: any): void {
        if(isDevMode())
            throw error;

        this.toastrService.error('Un Unexpected error happened.','Error');
    }

}