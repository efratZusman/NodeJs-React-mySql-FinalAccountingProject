import MyApp from './components/MyApp';
import './App.css';
import { UserProvider } from './components/UserContext';

function App() {
  return (
    <UserProvider>
      <MyApp />
    </UserProvider>
  );
}

export default App;
