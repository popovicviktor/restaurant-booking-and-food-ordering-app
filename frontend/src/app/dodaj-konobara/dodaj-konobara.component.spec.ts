import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajKonobaraComponent } from './dodaj-konobara.component';

describe('DodajKonobaraComponent', () => {
  let component: DodajKonobaraComponent;
  let fixture: ComponentFixture<DodajKonobaraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodajKonobaraComponent]
    });
    fixture = TestBed.createComponent(DodajKonobaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
