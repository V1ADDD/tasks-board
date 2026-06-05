import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { IssueStore } from '../../core/store/issue.store';
import { form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-create-issue-dialog',
  imports: [FormField],
  templateUrl: './create-issue-dialog.html',
  styleUrl: './create-issue-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateIssueDialog {
  private issueStore = inject(IssueStore);

  private dialogRef = viewChild<ElementRef<HTMLDialogElement>>('modalElement');

  protected issueModel = signal({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  protected issueForm = form(this.issueModel, (path) => {
    required(path.title, { message: 'A descriptive title is mandatory' });
    required(path.description, { message: 'Please provide task context' });
    minLength(path.description, 15, { message: 'Description must contain at least 15 characters' });
  });

  openModal(): void {
    this.issueModel.set({ title: '', description: '', priority: 'Medium' });
    this.dialogRef()?.nativeElement.showModal();
  }

  closeModal(): void {
    this.dialogRef()?.nativeElement.close();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.issueForm().valid()) {
      return;
    }

    this.issueStore.createIssue(this.issueModel());
    this.closeModal();
  }
}
