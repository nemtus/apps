import { signInWithApplePopup } from 'utils/firebase';
import { FaApple } from 'react-icons/fa';

const SignInWithApplePopupButton = () => {
  const handleSignInWithApplePopup = async () => {
    await signInWithApplePopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 w-64 m-2"
      onClick={handleSignInWithApplePopup}
    >
      <FaApple className="inline-block mr-2" /> Sign in with Apple
    </button>
  );
};

export default SignInWithApplePopupButton;
