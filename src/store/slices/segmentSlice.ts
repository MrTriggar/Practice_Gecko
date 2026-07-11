import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { segmentsApi } from '../../api/segments';
import type { Segment } from '../../types';

interface SegmentState {
  segments: Segment[];
  selectedSegment: Segment | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

const initialState: SegmentState = {
  segments: [],
  selectedSegment: null,
  isLoading: false,
  error: null,
  isSaving: false,
};

export const fetchSegments = createAsyncThunk(
  'segments/fetchByTask',
  async (taskId: string) => {
    const response = await segmentsApi.getByTaskId(taskId);
    return response.data;
  }
);

export const updateSegment = createAsyncThunk(
  'segments/update',
  async ({ id, data }: { id: string; data: Partial<Segment> }) => {
    const response = await segmentsApi.update(id, data);
    return response.data;
  }
);

export const createSegment = createAsyncThunk(
  'segments/create',
  async ({ taskId, data }: { taskId: string; data: Partial<Segment> }) => {
    const response = await segmentsApi.create(taskId, data);
    return response.data;
  }
);

export const deleteSegment = createAsyncThunk(
  'segments/delete',
  async (id: string) => {
    await segmentsApi.delete(id);
    return id;
  }
);

const segmentSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    setSelectedSegment: (state, action: PayloadAction<Segment | null>) => {
      state.selectedSegment = action.payload;
    },
    updateSegmentLocally: (state, action: PayloadAction<Segment>) => {
      const index = state.segments.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.segments[index] = action.payload;
      }
      if (state.selectedSegment?.id === action.payload.id) {
        state.selectedSegment = action.payload;
      }
    },
    clearSegments: (state) => {
      state.segments = [];
      state.selectedSegment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSegments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSegments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.segments = action.payload;
        if (action.payload.length > 0) {
          state.selectedSegment = action.payload[0];
        }
      })
      .addCase(fetchSegments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки сегментов';
      })
      .addCase(updateSegment.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateSegment.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.segments.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.segments[index] = action.payload;
        }
        if (state.selectedSegment?.id === action.payload.id) {
          state.selectedSegment = action.payload;
        }
      })
      .addCase(updateSegment.rejected, (state) => {
        state.isSaving = false;
      })
      .addCase(deleteSegment.fulfilled, (state, action) => {
        state.segments = state.segments.filter(s => s.id !== action.payload);
        if (state.selectedSegment?.id === action.payload) {
          state.selectedSegment = state.segments[0] || null;
        }
      });
  },
});

export const { setSelectedSegment, updateSegmentLocally, clearSegments } = segmentSlice.actions;
export default segmentSlice.reducer;