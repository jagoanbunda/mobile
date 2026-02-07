import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { childService } from '@/services/api/children';
import { CreateChildRequest, UpdateChildRequest } from '@/types';
import { useAuth } from '@/context/AuthContext';

/** Query keys */
export const childKeys = {
  all: ['children'] as const,
  lists: () => [...childKeys.all, 'list'] as const,
  list: (activeOnly?: boolean) => [...childKeys.lists(), { activeOnly }] as const,
  details: () => [...childKeys.all, 'detail'] as const,
  detail: (id: number) => [...childKeys.details(), id] as const,
  summaries: () => [...childKeys.all, 'summary'] as const,
  summary: (id: number) => [...childKeys.summaries(), id] as const,
};

/**
 * Fetch all children
 */
export function useChildren(activeOnly?: boolean, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: childKeys.list(activeOnly),
    queryFn: () => childService.getAll(activeOnly),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  });
}

/**
 * Fetch a single child
 */
export function useChild(childId: number) {
  return useQuery({
    queryKey: childKeys.detail(childId),
    queryFn: () => childService.getById(childId),
    enabled: childId > 0,
  });
}

/**
 * Fetch child health summary
 */
export function useChildSummary(childId: number) {
  return useQuery({
    queryKey: childKeys.summary(childId),
    queryFn: () => childService.getSummary(childId),
    enabled: childId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (summary changes frequently)
  });
}

/**
 * Create a new child
 */
export function useCreateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChildRequest) => childService.create(data),
    onSuccess: (newChild) => {
      // Invalidate and refetch children list
      queryClient.invalidateQueries({ queryKey: childKeys.lists() });
      // Optionally pre-populate the detail cache
      queryClient.setQueryData(childKeys.detail(newChild.id), newChild);
    },
  });
}

/**
 * Update a child
 */
export function useUpdateChild(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateChildRequest) => childService.update(childId, data),
    onSuccess: (updatedChild) => {
      // Update detail cache
      queryClient.setQueryData(childKeys.detail(childId), updatedChild);
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: childKeys.lists() });
      // Invalidate summary as child data affects it
      queryClient.invalidateQueries({ queryKey: childKeys.summary(childId) });
    },
  });
}

/**
 * Delete a child
 */
export function useDeleteChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (childId: number) => childService.delete(childId),
    onSuccess: (_, childId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: childKeys.detail(childId) });
      queryClient.removeQueries({ queryKey: childKeys.summary(childId) });
      // Refetch lists
      queryClient.invalidateQueries({ queryKey: childKeys.lists() });
    },
  });
}

/**
 * Get the first (or selected) child - useful for single-child scenarios
 */
export function useActiveChild() {
  const { isAuthenticated, isLoading: isAuthLoading, isVerifying } = useAuth();
  
  // Don't fetch children until auth is fully verified
  const shouldFetch = isAuthenticated && !isAuthLoading && !isVerifying;
  
  const { data: children, ...rest } = useChildren(true, { enabled: shouldFetch });
  
  // TODO: In the future, support child selection via context/storage
  const activeChild = children?.[0] ?? null;
  
  return {
    ...rest,
    data: activeChild,
    children,
  };
}
