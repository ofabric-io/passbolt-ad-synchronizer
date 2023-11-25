import * as dotenv from 'dotenv';
import {logger} from './logger';

dotenv.config();

export async function validateEnv(requiredVariables: string[]): Promise<void> {
  const parsedEnv = process.env;

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
