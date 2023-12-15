import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';

import { CharacterCreatorComponent } from './components/character-creator/character-creator.component';
import { CharacterSelectorComponent } from './components/character-selector/character-selector.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { OptionsComponent } from './components/options/options.component';
import { MainGameComponent } from './components/main-game/main-game.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameBattleComponent } from './components/game-battle/game-battle.component';
import { GameShopComponent } from './components/game-shop/game-shop.component';
import { GameAdventureMenuComponent } from './components/game-adventure-menu/game-adventure-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterCreatorComponent,
    CharacterSelectorComponent,
    MainMenuComponent,
    OptionsComponent,
    MainGameComponent,
    AdminPanelComponent,
    TutorialComponent,
    HeaderComponent,
    FooterComponent,
    NavBarComponent,
    GameBattleComponent,
    GameShopComponent,
    GameAdventureMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
