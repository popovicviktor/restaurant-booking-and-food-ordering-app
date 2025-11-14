import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DostaveComponent } from './dostave.component';

describe('DostaveComponent', () => {
  let component: DostaveComponent;
  let fixture: ComponentFixture<DostaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DostaveComponent]
    });
    fixture = TestBed.createComponent(DostaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
