import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoraniVremeComponent } from './restorani-vreme.component';

describe('RestoraniVremeComponent', () => {
  let component: RestoraniVremeComponent;
  let fixture: ComponentFixture<RestoraniVremeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoraniVremeComponent]
    });
    fixture = TestBed.createComponent(RestoraniVremeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
