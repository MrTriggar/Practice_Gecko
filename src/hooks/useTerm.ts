import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchTerms, createTerm, updateTerm } from '../store/slices/termSlice';
import type { Term } from '../types';

export const useTerm = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { terms, isLoading, error } = useSelector(
    (state: RootState) => state.terms
  );

  const loadTerms = async (projectId: string) => {
    try {
      const result = await dispatch(fetchTerms(projectId)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createNewTerm = async (projectId: string, data: Partial<Term>) => {
    try {
      const result = await dispatch(createTerm({ projectId, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateTermData = async (id: string, data: Partial<Term>) => {
    try {
      const result = await dispatch(updateTerm({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    terms,
    isLoading,
    error,
    loadTerms,
    createNewTerm,
    updateTermData,
  };
};