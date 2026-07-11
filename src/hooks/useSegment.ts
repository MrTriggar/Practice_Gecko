import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
// ВАЖНО: правильное имя файла - segmentSlice
import { 
  fetchSegments, 
  updateSegment, 
  createSegment, 
  deleteSegment,
  setSelectedSegment,
  updateSegmentLocally,
  clearSegments 
} from '../store/slices/segmentSlice';
import type { Segment } from '../types';

export const useSegment = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { segments, selectedSegment, isLoading, error, isSaving } = useSelector(
    (state: RootState) => state.segments
  );

  const loadSegments = async (taskId: string) => {
    try {
      const result = await dispatch(fetchSegments(taskId)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateSegmentData = async (id: string, data: Partial<Segment>) => {
    try {
      const result = await dispatch(updateSegment({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateLocalSegment = (segment: Segment) => {
    dispatch(updateSegmentLocally(segment));
  };

  const createNewSegment = async (taskId: string, data: Partial<Segment>) => {
    try {
      const result = await dispatch(createSegment({ taskId, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteSegmentData = async (id: string) => {
    try {
      const result = await dispatch(deleteSegment(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const selectSegment = (segment: Segment | null) => {
    dispatch(setSelectedSegment(segment));
  };

  const clearAllSegments = () => {
    dispatch(clearSegments());
  };

  return {
    segments,
    selectedSegment,
    isLoading,
    error,
    isSaving,
    loadSegments,
    updateSegmentData,
    updateLocalSegment,
    createNewSegment,
    deleteSegmentData,
    selectSegment,
    clearAllSegments,
  };
};