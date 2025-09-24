import { Routes } from '@angular/router';
import { HomeComponent } from './modulos/home/ui/main/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'rooms', pathMatch: 'full' },
    
    // ruta principal
    { path: 'rooms', component: HomeComponent }
];
