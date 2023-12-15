import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './components/options/options.component';
import { CharacterSelectorComponent } from './components/character-selector/character-selector.component';
import { CharacterCreatorComponent } from './components/character-creator/character-creator.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MainGameComponent } from './components/main-game/main-game.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { GameBattleComponent } from './components/game-battle/game-battle.component';
import { GameShopComponent } from './components/game-shop/game-shop.component';
import { GameAdventureMenuComponent } from './components/game-adventure-menu/game-adventure-menu.component';

const routes: Routes = [
  {path:'', component: MainMenuComponent},
  {path:'main-menu', component: MainMenuComponent},
  {path:'character-creator', component: CharacterCreatorComponent},
  {path:'charactor-selector', component: CharacterSelectorComponent},
  {path:'options', component: OptionsComponent},
  {path:'admin-panel', component: AdminPanelComponent},
  {path:'tutorial', component: TutorialComponent},
  {path:'main-game', component: MainGameComponent, 
  children: [
    {path: 'adventure-menu', component: GameAdventureMenuComponent},
    {path: 'battle', component: GameBattleComponent},
    {path: 'shop', component: GameShopComponent}
  ]},
  // {path:'', redirectTo: 'mainmenu', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
