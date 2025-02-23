import { createReducer, on } from '@ngrx/store';
import { ParentActions } from './parent.actions';
import { ParentState } from './parent.types';

const initialState: ParentState = {
  children: {
    items: [],
    loading: false,
    error: null
  },
  tasks: {
    items: [],
    loading: false,
    error: null
  },
  behavior: {
    items: [],
    loading: false,
    error: null
  },
  calendar: {
    items: [],
    loading: false,
    error: null
  }
};

export const parentReducer = createReducer(
  initialState,
  
  // Children reducers
  on(ParentActions.loadChildren, (state) => ({
    ...state,
    children: { ...state.children, loading: true, error: null }
  })),
  on(ParentActions.loadChildrenSuccess, (state, { children }) => ({
    ...state,
    children: { items: children, loading: false, error: null }
  })),
  on(ParentActions.loadChildrenFailure, (state, { error }) => ({
    ...state,
    children: { ...state.children, loading: false, error }
  })),

  // Add similar patterns for other actions...
); 