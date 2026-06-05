import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { ProjectStore } from '../../core/store/project.store';

@Component({
  selector: 'app-create-project-dialog',
  imports: [FormField],
  templateUrl: './create-project-dialog.html',
  styleUrl: './create-project-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectDialog {
  private projectStore = inject(ProjectStore);
  private dialogRef = viewChild<ElementRef<HTMLDialogElement>>('projectModal');

  protected projectModel = signal({
    name: '',
    code: '',
  });

  protected projectForm = form(this.projectModel, (path) => {
    required(path.name, { message: 'Project Name is required.' });
    required(path.code, { message: 'Project Code/Prefix identifier is required.' });
    maxLength(path.code, 5, { message: 'Code cannot exceed 5 characters.' });
  });

  openModal(): void {
    this.projectModel.set({ name: '', code: '' });
    this.dialogRef()?.nativeElement.showModal();
  }

  closeModal(): void {
    this.dialogRef()?.nativeElement.close();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.projectForm().valid()) return;

    this.projectStore.createProject(this.projectModel());
    this.closeModal();
  }
}
