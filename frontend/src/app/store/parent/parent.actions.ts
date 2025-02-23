import { createActionGroup, props, emptyProps } from '@ngrx/store';
import {
  Child,
  Task,
  BehaviorRecord,
  CalendarEvent,
} from '../../core/types/api.types';

export const ParentActions = createActionGroup({
  source: 'Parent',
  events: {
    // Children actions
    'Load Children': emptyProps(),
    'Load Children Success': props<{ children: Child[] }>(),
    'Load Children Failure': props<{ error: string }>(),
    'Add Child': props<{ child: Omit<Child, 'id' | 'parentId'> }>(),
    'Add Child Success': props<{ child: Child }>(),
    'Add Child Failure': props<{ error: string }>(),
    'Update Child': props<{ id: string; child: Partial<Child> }>(),
    'Update Child Success': props<{ child: Child }>(),
    'Update Child Failure': props<{ error: string }>(),
    'Delete Child': props<{ id: string }>(),
    'Delete Child Success': props<{ id: string }>(),
    'Delete Child Failure': props<{ error: string }>(),

    // Tasks actions
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),
    'Add Task': props<{ task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }>(),
    'Add Task Success': props<{ task: Task }>(),
    'Add Task Failure': props<{ error: string }>(),
    'Update Task': props<{ id: string; task: Partial<Task> }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Failure': props<{ error: string }>(),
    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),

    // Behavior actions
    'Load Behavior Records': props<{ childId: string }>(),
    'Load Behavior Records Success': props<{ records: BehaviorRecord[] }>(),
    'Load Behavior Records Failure': props<{ error: string }>(),
    'Add Behavior Record': props<{
      childId: string;
      record: Omit<BehaviorRecord, 'id'>;
    }>(),
    'Add Behavior Record Success': props<{ record: BehaviorRecord }>(),
    'Add Behavior Record Failure': props<{ error: string }>(),

    // Calendar actions
    'Load Calendar Events': emptyProps(),
    'Load Calendar Events Success': props<{ events: CalendarEvent[] }>(),
    'Load Calendar Events Failure': props<{ error: string }>(),
    'Add Calendar Event': props<{ event: Omit<CalendarEvent, 'id'> }>(),
    'Add Calendar Event Success': props<{ event: CalendarEvent }>(),
    'Add Calendar Event Failure': props<{ error: string }>(),
    'Update Calendar Event': props<{
      id: string;
      event: Partial<CalendarEvent>;
    }>(),
    'Update Calendar Event Success': props<{ event: CalendarEvent }>(),
    'Update Calendar Event Failure': props<{ error: string }>(),
    'Delete Calendar Event': props<{ id: string }>(),
    'Delete Calendar Event Success': props<{ id: string }>(),
    'Delete Calendar Event Failure': props<{ error: string }>(),
  },
});
