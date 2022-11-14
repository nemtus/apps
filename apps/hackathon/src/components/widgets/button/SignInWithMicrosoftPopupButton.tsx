import { signInWithMicrosoftPopup } from 'utils/firebase';
import { FaMicrosoft } from 'react-icons/fa';

const SignInWithMicrosoftPopupButton = () => {
  const handleSignInWithMicrosoftPopup = async () => {
    await signInWithMicrosoftPopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 w-64 m-2"
      onClick={handleSignInWithMicrosoftPopup}
    >
      <FaMicrosoft className="inline-block mr-2" /> Sign in with Microsoft
    </button>
  );
};

export default SignInWithMicrosoftPopupButton;
