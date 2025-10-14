import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { ResponseApi } from "../../../domain/models/responseApi";
import { ToolsService } from "../tools/tools.service";
import { HomeUserCases } from "../../../../home/domain/usecase/home-usecase";
@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(
        private _homeUseCases: HomeUserCases,
        private toolsService: ToolsService
    ){}

    
}