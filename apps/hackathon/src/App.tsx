import { BrowserRouter, Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import './App.css';
import AuthSignInPageComponent from 'components/pages/auth/sign-in';
import AppHeader from 'components/widgets/app-header';

const HomePageComponent = loadable(() => import('components/pages/home'));

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/auth/sign-in" element={<AuthSignInPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
