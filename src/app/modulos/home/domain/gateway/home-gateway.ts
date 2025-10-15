import { ResponseApi } from "../../../shared/domain/models/responseApi";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { GameMap } from "../../../shared/domain/models/gameMap";

@Injectable({
  providedIn: 'root' // o 'any'
})
export abstract class HomeGateway{
    abstract getMapLevel(gameMap:GameMap): Observable<ResponseApi>;
}