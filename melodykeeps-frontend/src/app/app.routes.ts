import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PlayerDemoComponent } from './components/music-player/player-demo.component';
import { DemoMultipleComponent } from './components/music-player/demo-multiple.component';
import { KeychainLayoutPlannerComponent } from './components/keychain-layout-planner.component';
import { FrontSheetLayoutComponent } from './components/front-sheet-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'player-demo', component: PlayerDemoComponent },
  { path: 'demo-multiple', component: DemoMultipleComponent },
  { path: 'keychain-planner', component: KeychainLayoutPlannerComponent },
  { path: 'front-sheet', component: FrontSheetLayoutComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
