import * as dotenv from 'dotenv';
import {logger} from './logger';

dotenv.config();

export function validateEnv(requiredVariables: string[]): void {
  const parsedEnv = dotenv.config().parsed as Object;

  // Check if all required variables are present
  const missingVariables = requiredVariables.filter(
    variable => !(variable in parsedEnv)
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(', ')}`
    );
  }

  logger('Environment variables validation passed.');
}
