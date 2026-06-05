import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssueDialog } from './create-issue-dialog';

describe('CreateIssueDialog', () => {
  let component: CreateIssueDialog;
  let fixture: ComponentFixture<CreateIssueDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIssueDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateIssueDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
