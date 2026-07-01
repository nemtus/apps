import { signInWithFacebookPopup } from 'utils/firebase';
import { FaFacebook } from 'react-icons/fa';

const SignInWithFacebookPopupButton = () => {
  const handleSignInWithFacebookPopup = async () => {
    await signInWithFacebookPopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 bg-blue-500 w-64 m-2"
      onClick={handleSignInWithFacebookPopup}
    >
      <FaFacebook className="inline-block mr-2" /> Sign in with Facebook
    </button>
  );
};

export default SignInWithFacebookPopupButton;
