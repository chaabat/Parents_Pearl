import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as AdminActions from '../../../store/admin/admin.actions';
import * as AdminSelectors from '../../../store/admin/admin.selectors';
import { UserDetailsDialogComponent } from '../user-details-dialog/user-details-dialog.component';
import { Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

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
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  protected AdminSelectors = AdminSelectors;

  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];
  searchControl = new FormControl('');
  loading$ = this.store.select(AdminSelectors.selectAdminLoading);
  error$ = this.store.select(AdminSelectors.selectAdminError);

  parentsDataSource = new MatTableDataSource<Parent>([]);
  childrenDataSource = new MatTableDataSource<Child>([]);
  adminsDataSource = new MatTableDataSource<Admin>([]);
  bannedUsersDataSource = new MatTableDataSource<any>([]);

  activeTabIndex = 0;
  totalParents = 0;
  totalChildren = 0;
  totalBanned = 0;

  @ViewChild('parentsPaginator') parentsPaginator!: MatPaginator;
  @ViewChild('childrenPaginator') childrenPaginator!: MatPaginator;
  @ViewChild('bannedPaginator') bannedPaginator!: MatPaginator;

  constructor(private store: Store, private dialog: MatDialog) {
    this.initializeDataSources();
  }

  private initializeDataSources() {
    this.store
      .select(AdminSelectors.selectParents)
      .pipe(takeUntil(this.destroy$))
      .subscribe((parents) => {
        this.parentsDataSource.data = parents;
        this.totalParents = parents.length;
        if (this.parentsPaginator) {
          this.parentsDataSource.paginator = this.parentsPaginator;
        }
      });

    this.store
      .select(AdminSelectors.selectChildren)
      .pipe(takeUntil(this.destroy$))
      .subscribe((children) => {
        this.childrenDataSource.data = children;
        this.totalChildren = children.length;
        if (this.childrenPaginator) {
          this.childrenDataSource.paginator = this.childrenPaginator;
        }
      });

    this.store
      .select(AdminSelectors.selectBannedUsers)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.bannedUsersDataSource.data = users || [];
        this.totalBanned = users?.length || 0;
        if (this.bannedPaginator) {
          this.bannedUsersDataSource.paginator = this.bannedPaginator;
        }
      });
  }

  ngOnInit() {
    this.loadUsers();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query) {
          this.applyFilter(query);
        } else {
          this.clearFilter();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(filterValue: string) {
    const filterValueLowercase = filterValue.trim().toLowerCase();

    // Apply filter to the active tab's data source
    switch (this.activeTabIndex) {
      case 0: // Parents tab
        this.parentsDataSource.filter = filterValueLowercase;
        break;
      case 1: // Children tab
        this.childrenDataSource.filter = filterValueLowercase;
        break;
      case 2: // Banned users tab
        this.bannedUsersDataSource.filter = filterValueLowercase;
        break;
    }
  }

  clearFilter() {
    this.searchControl.setValue('');
    this.parentsDataSource.filter = '';
    this.childrenDataSource.filter = '';
    this.bannedUsersDataSource.filter = '';
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    // Clear filter when changing tabs
    this.clearFilter();
  }

  banUser(userId: number) {
    this.store.dispatch(
      AdminActions.banUser({
        userId,
        userType: 'parent',
      })
    );
  }

  unbanUser(userId: number) {
    this.store.dispatch(
      AdminActions.unbanUser({
        userId,
        userType: 'parent',
      })
    );
  }

  viewDetails(user: any) {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '500px',
      data: user,
      panelClass: 'custom-dialog-container',
    });
  }

  loadUsers() {
    this.store.dispatch(AdminActions.loadParents());
    this.store.dispatch(AdminActions.loadChildren());
    this.store.dispatch(AdminActions.loadBannedUsers());
  }

  // Configure the filter predicate for each data source
  setupFilterPredicates() {
    this.parentsDataSource.filterPredicate = (data: Parent, filter: string) => {
      return (
        data.name.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter)
      );
    };

    this.childrenDataSource.filterPredicate = (data: Child, filter: string) => {
      return (
        data.name.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter)
      );
    };

    this.bannedUsersDataSource.filterPredicate = (
      data: any,
      filter: string
    ) => {
      return (
        data.name?.toLowerCase().includes(filter) ||
        data.email?.toLowerCase().includes(filter)
      );
    };
  }

  getStatusClass(banned: boolean): string {
    return banned
      ? 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
  }
}
