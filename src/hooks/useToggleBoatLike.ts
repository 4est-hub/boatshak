import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Boat } from '@/types/boat'
import { toggleBoatLike } from '@/services/boats'

interface BoatsQueryData {
  pages: {
    boats: Boat[]
    total: number
    page: number
  }[]
}

interface MutateVariables {
  id: string
  liked: boolean
}

interface MutateContext {
  previousData?: BoatsQueryData
}

export function useToggleBoatLike() {
  const queryClient = useQueryClient()

  return useMutation<{ id: string; liked: boolean }, Error, MutateVariables, MutateContext>({
    mutationFn: ({ id, liked }) => toggleBoatLike(id, liked),

    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: ['boats'] })

      const previousData = queryClient.getQueryData<BoatsQueryData>(['boats'])

      queryClient.setQueryData<BoatsQueryData>(['boats'], oldData => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            boats: page.boats.map(boat =>
              boat.id === id ? { ...boat, liked } : boat
            ),
          })),
        }
      })

      return { previousData }
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['boats'], context.previousData)
      }
    },
  })
}
