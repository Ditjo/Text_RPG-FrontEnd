import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAdventureMenuComponent } from './game-adventure-menu.component';

describe('GameAdventureMenuComponent', () => {
  let component: GameAdventureMenuComponent;
  let fixture: ComponentFixture<GameAdventureMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameAdventureMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameAdventureMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
