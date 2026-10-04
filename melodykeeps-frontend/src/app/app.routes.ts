import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PlayerDemoComponent } from './components/music-player/player-demo.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'player-demo', component: PlayerDemoComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
