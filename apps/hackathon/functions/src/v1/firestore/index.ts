import { exportFunctionsModule } from '../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['admin'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'firestore', domain], exports)
);
