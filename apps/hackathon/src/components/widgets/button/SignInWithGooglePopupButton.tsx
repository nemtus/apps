import { signInWithGooglePopup } from 'utils/firebase';
import { FaGoogle } from 'react-icons/fa';

const SignInWithGooglePopupButton = () => {
  const handleSignInWithGooglePopup = async () => {
    await signInWithGooglePopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 bg-cyan-500 w-64 m-2"
      onClick={handleSignInWithGooglePopup}
    >
      <FaGoogle className="inline-block mr-2" /> Sign in with Google
    </button>
  );
};

export default SignInWithGooglePopupButton;
