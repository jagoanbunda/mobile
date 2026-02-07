import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { childService } from '@/services/api/children';
import { CreateChildRequest, UpdateChildRequest, Child } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { preferencesStorage } from '@/services/storage/preferences';

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
 * Get the active (selected) child with persistence
 * Supports child selection via AsyncStorage
 */
export function useActiveChild() {
  const { isAuthenticated, isLoading: isAuthLoading, isVerifying } = useAuth();
  const [activeChildId, setActiveChildId] = useState<number | null>(null);
  const [isLoadingPreference, setIsLoadingPreference] = useState(true);

  // Don't fetch children until auth is fully verified
  const shouldFetch = isAuthenticated && !isAuthLoading && !isVerifying;

  const { data: children, ...rest } = useChildren(true, { enabled: shouldFetch });

  // Load persisted child preference on mount
  useEffect(() => {
    async function loadPreference() {
      try {
        const storedChildId = await preferencesStorage.getActiveChildId();
        setActiveChildId(storedChildId);
      } catch (error) {
        console.error('Failed to load active child preference:', error);
      } finally {
        setIsLoadingPreference(false);
      }
    }
    loadPreference();
  }, []);

  // Determine the active child:
  // 1. Use stored preference if valid (child still exists)
  // 2. Fall back to first child
  const activeChild = (() => {
    if (!children || children.length === 0) return null;

    // If we have a stored preference, verify it's still valid
    if (activeChildId !== null) {
      const storedChild = children.find((c: Child) => c.id === activeChildId);
      if (storedChild) return storedChild;
    }

    // Fall back to first child
    return children[0];
  })();

  /**
   * Select a different child as active
   * @param childId - The child ID to set as active
   */
  const selectChild = useCallback(async (childId: number) => {
    try {
      await preferencesStorage.setActiveChildId(childId);
      setActiveChildId(childId);
    } catch (error) {
      console.error('Failed to save active child preference:', error);
      throw error;
    }
  }, []);

  /**
   * Clear the active child selection (resets to first child)
   */
  const clearSelection = useCallback(async () => {
    try {
      await preferencesStorage.removeActiveChildId();
      setActiveChildId(null);
    } catch (error) {
      console.error('Failed to clear active child preference:', error);
      throw error;
    }
  }, []);

  return {
    ...rest,
    isLoading: rest.isLoading || isLoadingPreference,
    data: activeChild,
    children,
    activeChildId: activeChild?.id ?? null,
    selectChild,
    clearSelection,
    hasChildren: (children?.length ?? 0) > 0,
  };
}
