import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// PayloadAction не используется в этом файле, поэтому его не импортируем
import { termsApi } from '../../api/terms';
import type { Term } from '../../types';

interface TermState {
  terms: Term[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TermState = {
  terms: [],
  isLoading: false,
  error: null,
};

export const fetchTerms = createAsyncThunk(
  'terms/fetchByProject',
  async (projectId: string) => {
    const response = await termsApi.getByProjectId(projectId);
    return response.data;
  }
);

export const createTerm = createAsyncThunk(
  'terms/create',
  async ({ projectId, data }: { projectId: string; data: Partial<Term> }) => {
    const response = await termsApi.create(projectId, data);
    return response.data;
  }
);

export const updateTerm = createAsyncThunk(
  'terms/update',
  async ({ id, data }: { id: string; data: Partial<Term> }) => {
    const response = await termsApi.update(id, data);
    return response.data;
  }
);

const termSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.terms = action.payload;
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки терминов';
      })
      .addCase(createTerm.fulfilled, (state, action) => {
        state.terms.push(action.payload);
      })
      .addCase(updateTerm.fulfilled, (state, action) => {
        const index = state.terms.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.terms[index] = action.payload;
        }
      });
  },
});

export default termSlice.reducer;