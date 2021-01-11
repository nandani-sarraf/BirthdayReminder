import './PersonOptions.scss';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext/AppContext';
import findPersonByID from '../../helper/findPersonByID';
import {
  putItemToIDB,
  removeDataFromIDBStore,
} from '../../utils/IndexedDB/indexedDBManagement';

function PersonOptions({ currentPersonID, setCurrentPersonID }) {
  const { state, dispatch, backgroundState } = useContext(AppContext);
  const person = findPersonByID(state.people, currentPersonID);
  const [, setShowBackground] = backgroundState;
  const isPersonInFavourites = () => {
    // Prevents the person from being added to favorites again.
    return state.favourites.some((person) => person.id === currentPersonID);
  };

  const addToFavoritesHandler = () => {
    dispatch({
      type: 'ADD_FAVOURITE',
      payload: [...state.favourites, person],
    });
    putItemToIDB(person, 'userDatabase', '1', 'favourites');
    setCurrentPersonID(null);
  };

  const removeFromFavouritesHandler = () => {
    const newFavourites = state.favourites.filter(
      (person) => person.id !== currentPersonID
    );
    dispatch({
      type: 'REMOVE_FAVOURITE',
      payload: newFavourites,
    });
    removeDataFromIDBStore('userDatabase', '1', 'favourites', currentPersonID);
    setCurrentPersonID(null);
  };

  const setHandlerFunction = (e) => {
    e.stopPropagation();
    setShowBackground(false);
    return isPersonInFavourites()
      ? removeFromFavouritesHandler
      : addToFavoritesHandler;
  };

  const setText = () => {
    return isPersonInFavourites()
      ? 'Remove from favourites'
      : 'Add to favourites';
  };
  return (
    <div className="person-options-container">
      <p className="person-options-container__name">Person: {person.name}</p>
      <ul className="person-options-list">
        <li className="person-options-list__item">
          <button
            className="person-options-list__btn"
            onClick={(e) => setHandlerFunction(e)()}
          >
            {setText()}
          </button>
        </li>
        <hr className="person-options-list__line" />
        <li className="person-options-list__item">
          <button className="person-options-list__btn">Edit</button>
        </li>
      </ul>
    </div>
  );
}

export default PersonOptions;
