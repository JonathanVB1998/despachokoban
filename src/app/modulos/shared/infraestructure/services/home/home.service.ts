import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { ResponseApi } from "../../../domain/models/responseApi";
import { ToolsService } from "../tools/tools.service";
import { HomeUserCases } from "../../../../home/domain/usecase/home-usecase";
import { GameMap } from "../../../domain/models/gameMap";
@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(
        private _homeUseCases: HomeUserCases,
        private toolsService: ToolsService
    ){}

    async getMapLevel(gameMap: GameMap): Promise<string> {
        const res = await lastValueFrom(this._homeUseCases.getMapLevel(gameMap));
        return res.data;
    }
}