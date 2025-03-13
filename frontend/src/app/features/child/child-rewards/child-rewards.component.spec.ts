import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildRewardsComponent } from './child-rewards.component';

describe('ChildRewardsComponent', () => {
  let component: ChildRewardsComponent;
  let fixture: ComponentFixture<ChildRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildRewardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
