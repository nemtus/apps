import { signOut } from 'utils/firebase';
import { FaSignOutAlt } from 'react-icons/fa';

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <button
      className="btn btn-ghost border-hidden outline-0 m-2"
      onClick={handleSignOut}
    >
      <FaSignOutAlt className="inline-block mr-2" />
      Sign out
    </button>
  );
};

export default SignOutButton;
