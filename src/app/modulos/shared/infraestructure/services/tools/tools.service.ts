import { Injectable } from "@angular/core";
import { lastValueFrom, Observable } from "rxjs";
import { ResponseApi } from "../../../domain/models/responseApi";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ToolsService {
    public async handleResponse(
        data: Observable<ResponseApi>,
        showMessage: boolean
    ): Promise<ResponseApi | null>{
        try{
            const res = await lastValueFrom(data);
            return res;
        }catch(error){
            if(error instanceof HttpErrorResponse && error.status !== 0){
                const msg = error?.error?.data?.errorMessage ?? 'An unknown error occurred';
                if(showMessage){
                    alert(msg);
                }
                return error.error as ResponseApi;
            }

            const msg = 'An unknown error occurred';
            if(showMessage){
                alert(msg);
            }
            return {error:  true, message: msg, data: null}
        }
    }
}