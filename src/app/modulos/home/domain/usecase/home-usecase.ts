import { Injectable } from "@angular/core";
import { HomeGateway } from "../gateway/home-gateway";
import { ResponseApi } from "../../../shared/domain/models/responseApi";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HomeUserCases{
      constructor(private _homeGateway: HomeGateway){}
}