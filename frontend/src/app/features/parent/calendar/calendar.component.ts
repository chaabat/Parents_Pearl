import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CalendarEvent, ParentState } from '../../../store/parent/parent.types';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  events$ = this.store.select(
    (state: { parent: ParentState }) => state.parent.calendar.items
  );
  showAddForm = false;
  editingEvent: CalendarEvent | null = null;

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    participants: [[] as string[]],
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<{ parent: ParentState }>
  ) {}

  onSubmit() {
    if (this.eventForm.valid) {
      if (this.editingEvent) {
        // Dispatch update event action
        console.log('Update event:', {
          id: this.editingEvent.id,
          ...this.eventForm.value,
        });
      } else {
        // Dispatch add event action
        console.log('Add event:', this.eventForm.value);
      }
      this.closeForm();
    }
  }

  editEvent(event: CalendarEvent) {
    this.editingEvent = event;
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      startDate: this.formatDate(event.startDate),
      endDate: this.formatDate(event.endDate),
      participants: event.participants,
    });
    this.showAddForm = true;
  }

  deleteRecord(id: string) {
    // Dispatch delete event action
    console.log('Delete event:', id);
  }

  closeForm() {
    this.showAddForm = false;
    this.editingEvent = null;
    this.eventForm.reset();
  }

  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return new Date(date).toISOString().slice(0, 16);
    }
    return date.toISOString().slice(0, 16);
  }
}
