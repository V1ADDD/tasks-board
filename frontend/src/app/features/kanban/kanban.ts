import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { IssueStore } from '../../core/store/issue.store';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-kanban',
  imports: [CommonModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kanban implements OnInit {
  protected issueStore = inject(IssueStore);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params) => {
          const projectId = params['id'];
          if (projectId) {
            this.issueStore.loadIssuesByProject(projectId);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  changeCardStatus(issueId: string, nextStatus: 'ToDo' | 'InProgress' | 'Done'): void {
    this.issueStore.moveIssueStatus({ issueId, nextStatus });
  }
}
