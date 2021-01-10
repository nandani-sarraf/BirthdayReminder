import AppHead from '../AppHead/AppHead';
import HomeMain from '../HomeMain/HomeMain';
import MobileNav from '../MobileNav/MobileNav';
import { useEffect, useReducer, useState } from 'react';
import { AppContext } from '../../context/AppContext/AppContext';
import { reducer } from '../../utils/reducer';
import defaultState from '../../utils/defaultState';

function App() {
  // Default state.
  const def = {
    people: [],
    isModalOpen: false,
    modalContent: '',
    favourites: [],
  };

  const [state, dispatch] = useReducer(reducer, def);
  const [showFavourites, setShowFavourites] = useState(false);
  const favState = [showFavourites, setShowFavourites];
  const [showUI, setShowUI] = useState(true);
  const [currentPersonID, setCurrentPersonID] = useState(null);
  const getInitialData = async () => {
    const data = await defaultState();
    const people = data.people;
    const favourites = data.favourites;

    dispatch({
      type: 'INITIAL_LOAD',
      payload: { people: people, favourites: favourites },
    });
  };

  
  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <>
      <AppContext.Provider
        value={{ state: state, dispatch: dispatch, favState }}
      >
        <AppHead />
        <HomeMain
          showUI={showUI}
          setShowUI={setShowUI}
          currentPersonID={currentPersonID}
          setCurrentPersonID={setCurrentPersonID}
        />
        <MobileNav />
      </AppContext.Provider>
    </>
  );
}

export default App;
