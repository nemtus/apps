import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';
import AuthSignInPageComponent from 'components/pages/auth/sign-in';

const HomePageComponent = () => {
  const [authUser] = useAuthState(auth);

  return <>{!authUser ? <AuthSignInPageComponent /> : null}</>;
};

export default HomePageComponent;
