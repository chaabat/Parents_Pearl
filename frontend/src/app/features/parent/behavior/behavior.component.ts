import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorRecord } from '../../../store/parent/parent.types';

@Component({
  selector: 'app-behavior',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './behavior.component.html',
})
export class BehaviorComponent {
  behaviors$ = this.store.select((state) => state.parent.behaviors);
  showAddForm = false;

  behaviorForm = this.fb.group({
    type: ['POSITIVE', Validators.required],
    description: ['', Validators.required],
    points: [0, [Validators.required, Validators.min(0)]],
    childId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<{ parent: { behaviors: BehaviorRecord[] } }>
  ) {}

  onSubmit() {
    if (this.behaviorForm.valid) {
      // Dispatch action to add behavior record
      console.log(this.behaviorForm.value);
      this.showAddForm = false;
      this.behaviorForm.reset({ type: 'POSITIVE', points: 0 });
    }
  }

  deleteRecord(recordId: string) {
    // Implement delete functionality
    console.log('Delete record:', recordId);
  }
}
