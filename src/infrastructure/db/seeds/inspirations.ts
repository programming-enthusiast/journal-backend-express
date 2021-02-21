import * as inspirationsService from '../../../inspirations/inspirations-service'

export const seed = async (): Promise<void> => {
  await inspirationsService.createInspiration('Walk in the park')
}
