import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Child } from '../../../core/models';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css'],
})
export class ChildrenComponent implements OnInit {
  children$: Observable<Child[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  parentId: number | undefined;

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.children$ = this.store.select(ParentSelectors.selectChildren);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);
  }

  ngOnInit(): void {
    // Get parent ID from auth state and load children
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user?.id) {
        this.parentId = user.id;
        this.store.dispatch(ParentActions.loadChildren({ parentId: user.id }));
      }
    });
  }

  openAddChildDialog(): void {
    // TODO: Implement dialog component
    console.log('Opening add child dialog');
  }

  editChild(child: Child): void {
    // TODO: Implement dialog component
    console.log('Editing child:', child);
  }

  managePoints(child: Child): void {
    // TODO: Implement dialog component
    console.log('Managing points for child:', child);
  }

  viewTasks(child: Child): void {
    // Navigate to tasks page
    this.router.navigate(['/dashboard/tasks', child.id]);
  }

  viewPointHistory(child: Child): void {
    // TODO: Implement dialog component
    console.log('Viewing point history for child:', child);
  }

  deleteChild(child: Child): void {
    if (
      this.parentId &&
      confirm('Are you sure you want to delete this child?')
    ) {
      this.store.dispatch(
        ParentActions.deleteChild({
          parentId: this.parentId,
          childId: child.id,
        })
      );
    }
  }
}
