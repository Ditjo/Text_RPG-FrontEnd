import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBattleComponent } from './game-battle.component';

describe('GameBattleComponent', () => {
  let component: GameBattleComponent;
  let fixture: ComponentFixture<GameBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameBattleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
