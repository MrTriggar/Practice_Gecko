import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
// ВАЖНО: правильное имя файла - taskSlice
import { 
  fetchTasks, 
  fetchTaskById, 
  createTask, 
  updateTask,
  setCurrentTask,
  clearCurrentTask 
} from '../store/slices/taskSlice';
import type { Task } from '../types';

export const useTask = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { tasks, currentTask, isLoading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  const loadTasks = async () => {
    try {
      const result = await dispatch(fetchTasks()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const loadTaskById = async (id: string) => {
    try {
      const result = await dispatch(fetchTaskById(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createNewTask = async (data: Partial<Task>) => {
    try {
      const result = await dispatch(createTask(data)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateTaskData = async (id: string, data: Partial<Task>) => {
    try {
      const result = await dispatch(updateTask({ id, data })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const selectTask = (task: Task) => {
    dispatch(setCurrentTask(task));
  };

  const clearTask = () => {
    dispatch(clearCurrentTask());
  };

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    loadTasks,
    loadTaskById,
    createNewTask,
    updateTaskData,
    selectTask,
    clearTask,
  };
};