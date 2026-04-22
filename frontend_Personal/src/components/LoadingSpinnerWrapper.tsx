import { useLoading } from '../contexts/LoadingContext';
import { LoadingSpinner } from './LoadingSpinner';

export const LoadingSpinnerWrapper = () => {
  const { isLoading } = useLoading();
  return isLoading ? <LoadingSpinner /> : null;
};
