import { signInWithYahooPopup } from 'utils/firebase';
import { FaYahoo } from 'react-icons/fa';

const SignInWithYahooPopupButton = () => {
  const handleSignInWithYahooPopup = async () => {
    await signInWithYahooPopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 bg-red-500 w-64 m-2"
      onClick={handleSignInWithYahooPopup}
    >
      <FaYahoo className="inline-block mr-2" /> Sign in with Yahoo
    </button>
  );
};

export default SignInWithYahooPopupButton;
