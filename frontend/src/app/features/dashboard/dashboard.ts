import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../core/store/auth.store';
import { ProjectStore } from '../../core/store/project.store';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  protected authStore = inject(AuthStore);
  protected projectStore = inject(ProjectStore);

  ngOnInit(): void {
    this.projectStore.loadAllProjects();
  }
}
