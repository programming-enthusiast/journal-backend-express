import * as inspirationsService from '../../src/inspirations/inspirations-service';
import texts from './inspiration-texts.json';

async function seed(): Promise<void> {
  await Promise.all(
    texts.map(async (text) => await inspirationsService.createInspiration(text))
  );
}

export { seed };
