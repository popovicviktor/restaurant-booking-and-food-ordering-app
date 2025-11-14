import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajRestoranComponent } from './dodaj-restoran.component';

describe('DodajRestoranComponent', () => {
  let component: DodajRestoranComponent;
  let fixture: ComponentFixture<DodajRestoranComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodajRestoranComponent]
    });
    fixture = TestBed.createComponent(DodajRestoranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
