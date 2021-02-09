import { useContext, useState, useEffect } from 'react';
import './PersonList.scss';
import Person from '../Person/Person';
import EmptyBox from '../EmptyBox/EmptyBox';
import { AppContext } from '../../context/AppContext/AppContext';
import PeopleListContext from '../../context/PeopleListContext/PeopleListContext';
import DeletePersonDialog from '../DeletePersonDialog/DeletePersonDialog';
import { removeDataFromIDBStore } from '../../utils/IndexedDB/indexedDBManagement';
import AddPersonUI from '../AddPersonUI/AddPersonUI';
import EditPersonUI from '../EditPersonUI/EditPersonUI';
import Modal from '../Modal/Modal';
import filterFavouritePeople from '../../helper/filterFavouritePeople';

function PersonList(props) {
  const { currentPersonID, setCurrentPersonID, showUI } = props;
  const {
    state,
    dispatch,
    favState,
    backgroundState,
    showEditPersonUIState,
  } = useContext(AppContext);
  const [peopleList, setPeopleList] = useContext(PeopleListContext);
  const [showFavourites] = favState;
  const [showDeletePersonDialog, setShowDeletePersonDialog] = useState(false);
  const [showEditPersonUI, setShowEditPersonUI] = showEditPersonUIState;
  const [deletionUserID, setDeletionUserID] = useState(null);
  const [, setShowBackground] = backgroundState;
  const [isTimePassed, setIsTimePassed] = useState(true);
  const [showAddPersonUI, setShowAddPersonUI] = useState(false);
  const handleDeletePerson = (e, id) => {
    e.stopPropagation();
    setShowDeletePersonDialog(true);
    setDeletionUserID(id);
  };
  const showAddPersonUIHandler = () => {
    setShowAddPersonUI(!showAddPersonUI);
  };

  const removeItem = (id) => {
    const oldPeople = state.people;
    let newPeople = oldPeople.filter((person) => person.id !== id);
    removeDataFromIDBStore('userDatabase', '1', 'people', id);
    dispatch({
      type: 'REMOVE_PERSON',
      payload: { people: newPeople },
    });

    setShowBackground(false);
  };

  const selectPersonHandler = (id) => {
    const mql = window.matchMedia('(max-width: 768px)');
    if (mql.matches) {
      setShowBackground(true);
    }

    if (currentPersonID !== id && showUI) {
      setCurrentPersonID(id);
    }
  };

  const toggleAddPersonUIHandlerForLargerScreen = () => {
    setShowAddPersonUI(!showAddPersonUI);
  };

  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      setCurrentPersonID(null);
      setShowBackground(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', keyHandler);
    return () => {
      window.removeEventListener('keyup', keyHandler);
    };
  });

  useEffect(() => {
    const people = showFavourites
      ? filterFavouritePeople(state.people)
      : state.people;
    setPeopleList(people);
  }, [showFavourites, state.people, setPeopleList]);

  return (
    <>
      {state.isModalOpen && (
        <Modal isTimePassed={isTimePassed} setIsTimePassed={setIsTimePassed} />
      )}
      {showDeletePersonDialog && (
        <DeletePersonDialog
          setShowDeletePersonDialog={setShowDeletePersonDialog}
          removeItem={removeItem}
          deletionUserID={deletionUserID}
          setCurrentPersonID={setCurrentPersonID}
        />
      )}
      <ul className="person-list">
        <button className="person-list__btn">
          <i className="fas fa-sort person-list__icon"></i>
        </button>
        {peopleList &&
          peopleList.map((person) => (
            <Person
              key={person.id}
              person={person}
              handleDeletePerson={handleDeletePerson}
              currentPersonID={currentPersonID}
              setCurrentPersonID={setCurrentPersonID}
              selectPersonHandler={selectPersonHandler}
              setShowBackground={setShowBackground}
            />
          ))}
        {(showAddPersonUI && (
          <AddPersonUI showAddPersonUIHandler={showAddPersonUIHandler} />
        )) || (
          <EmptyBox
            toggleAddPersonUIHandlerForLargerScreen={
              toggleAddPersonUIHandlerForLargerScreen
            }
          />
        )}
      </ul>
      {showEditPersonUI && (
        <EditPersonUI
          currentPersonID={currentPersonID}
          setShowEditPersonUI={setShowEditPersonUI}
          setShowBackground={setShowBackground}
        />
      )}
    </>
  );
}

export default PersonList;
