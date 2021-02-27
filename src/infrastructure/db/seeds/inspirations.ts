import * as inspirationsService from '../../../inspirations/inspirations-service';
import texts from './inspiration-texts.json';

export const seed = async (): Promise<void> => {
  await Promise.all(
    texts.map(async (text) => await inspirationsService.createInspiration(text))
  );
};
