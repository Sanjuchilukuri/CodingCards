import { useContext } from 'react';
import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import Header from './components/Header/Header'
import {ThemeContext} from './context/ThemeContext';

function App() {

  const { currentTheme } = useContext(ThemeContext);

  return (
    <div className='container-fluid' data-theme= {currentTheme == "dark"?"dark":""} >
      <Header/>
      <Dashboard/>
    </div>
  )
}

export default App
