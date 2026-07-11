import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { tasksApi } from '../../api/tasks';
import type { Task } from '../../types';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async () => {
    const response = await tasksApi.getAll();
    return response.data;
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id: string) => {
    const response = await tasksApi.getById(id);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: Partial<Task>) => {
    const response = await tasksApi.create(data);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: Partial<Task> }) => {
    const response = await tasksApi.update(id, data);
    return response.data;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки задач';
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки задачи';
      });
  },
});

export const { setCurrentTask, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;