import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>User Details</h2>
    <mat-dialog-content>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-gray-600">Name</p>
          <p class="font-medium">{{ data.firstName }} {{ data.lastName }}</p>
        </div>
        <div>
          <p class="text-gray-600">Email</p>
          <p class="font-medium">{{ data.email }}</p>
        </div>
        <div>
          <p class="text-gray-600">Status</p>
          <p [class]="data.banned ? 'text-red-500' : 'text-green-500'" class="font-medium">
            {{ data.banned ? 'Banned' : 'Active' }}
          </p>
        </div>
        <div>
          <p class="text-gray-600">Join Date</p>
          <p class="font-medium">{{ data.createdAt | date }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class UserDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
} 