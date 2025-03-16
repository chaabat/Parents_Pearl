import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import * as AdminActions from '../../../store/admin/admin.actions';
import * as AdminSelectors from '../../../store/admin/admin.selectors';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { Observable, Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

// Models
import { Parent } from '../../../core/models/parent.model';
import { Child } from '../../../core/models/child.model';
import { Admin } from '../../../core/models/admin.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  protected AdminSelectors = AdminSelectors;

  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];
  searchControl = new FormControl('');

  parentsDataSource = new MatTableDataSource<Parent>([]);
  childrenDataSource = new MatTableDataSource<Child>([]);
  adminsDataSource = new MatTableDataSource<Admin>([]);
  bannedUsersDataSource = new MatTableDataSource<any>([]);

  @ViewChild('parentsPaginator') parentsPaginator!: MatPaginator;
  @ViewChild('childrenPaginator') childrenPaginator!: MatPaginator;

  @ViewChild('bannedPaginator') bannedPaginator!: MatPaginator;

  loading$ = this.store.select(AdminSelectors.selectAdminLoading);
  error$ = this.store.select(AdminSelectors.selectAdminError);

  constructor(public store: Store, private dialog: MatDialog) {
    this.initializeDataSources();
  }

  ngOnInit() {
    console.log('Initializing Users Component...');
    this.loadAllData();
  }

  private loadAllData() {
    console.log('Loading all data...');
    this.store.dispatch(AdminActions.loadParents());
    this.store.dispatch(AdminActions.loadChildren());
    this.store.dispatch(AdminActions.loadBannedUsers());
  }

  private initializeDataSources() {
    this.store
      .select(AdminSelectors.selectParents)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (parents) => {
          console.log('Received parents:', parents);
          this.parentsDataSource.data = parents || [];
          if (this.parentsPaginator) {
            this.parentsDataSource.paginator = this.parentsPaginator;
          }
        },
        error: (error) => console.error('Error in parents subscription:', error)
      });

    this.store
      .select(AdminSelectors.selectChildren)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (children) => {
          console.log('Received children:', children);
          this.childrenDataSource.data = children || [];
          if (this.childrenPaginator) {
            this.childrenDataSource.paginator = this.childrenPaginator;
          }
        },
        error: (error) => console.error('Error in children subscription:', error)
      });

    this.store
      .select(AdminSelectors.selectBannedUsers)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          console.log('Received banned users:', users);
          this.bannedUsersDataSource.data = users || [];
          if (this.bannedPaginator) {
            this.bannedUsersDataSource.paginator = this.bannedPaginator;
          }
        },
        error: (error) => console.error('Error in banned users subscription:', error)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  banUser(userId: number, userType: 'parent' | 'child') {
    console.log('Banning user:', userId, 'type:', userType);
    this.store.dispatch(AdminActions.banUser({ userId, userType }));
  }

  unbanUser(userId: number, userType: 'parent' | 'child') {
    console.log('Unbanning user:', userId, 'type:', userType);
    this.store.dispatch(AdminActions.unbanUser({ userId, userType }));
  }

  viewDetails(user: any) {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '500px',
      data: user,
    });
  }

  getUserTypeLabel(type: string): string {
    return type === 'parent' ? 'Parent' : 'Child';
  }
}
