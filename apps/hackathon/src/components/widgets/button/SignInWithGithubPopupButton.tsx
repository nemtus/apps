import { signInWithGithubPopup } from 'utils/firebase';
import { FaGithub } from 'react-icons/fa';

const SignInWithGithubPopupButton = () => {
  const handleSignInWithGithubPopup = async () => {
    await signInWithGithubPopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 w-64 m-2"
      onClick={handleSignInWithGithubPopup}
    >
      <FaGithub className="inline-block mr-2" /> Sign in with GitHub
    </button>
  );
};

export default SignInWithGithubPopupButton;
