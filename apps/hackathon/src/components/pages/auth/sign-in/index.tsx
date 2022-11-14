import SignInWithGooglePopupButton from 'components/widgets/button/SignInWithGooglePopupButton';
import SignInWithFacebookPopupButton from 'components/widgets/button/SignInWithFacebookPopupButton';
import SignInWithTwitterPopupButton from 'components/widgets/button/SignInWithTwitterPopupButton';
import SignInWithGithubPopupButton from 'components/widgets/button/SignInWithGithubPopupButton';
import SignInWithYahooPopupButton from 'components/widgets/button/SignInWithYahooPopupButton';
import SignInWithMicrosoftPopupButton from 'components/widgets/button/SignInWithMicrosoftPopupButton';
import SignInWithApplePopupButton from 'components/widgets/button/SignInWithApplePopupButton';

const AuthSignInPageComponent = () => {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div className="max-w-5xl">
          <h1 className="text-5xl font-bold">Sign in</h1>
          <p className="py-6">
            You can sign in with your Google, Facebook, Twitter, GitHub, Yahoo,
            Microsoft, Apple account.
          </p>
          <div>
            <SignInWithGooglePopupButton />
            <SignInWithFacebookPopupButton />
            <SignInWithTwitterPopupButton />
            <SignInWithGithubPopupButton />
            <SignInWithYahooPopupButton />
            <SignInWithMicrosoftPopupButton />
            <SignInWithApplePopupButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignInPageComponent;
