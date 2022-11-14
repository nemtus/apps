import { exportFunctionsModule } from '../utils/firebase/deploy';

// Note: Register sub-directories
const domains = ['auth', 'firestore', 'https', 'pubsub', 'storage'];

domains.forEach((domain) => exportFunctionsModule(['v1', domain], exports));
