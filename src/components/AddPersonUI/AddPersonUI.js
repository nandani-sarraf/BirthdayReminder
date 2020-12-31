import './AddPersonUI.scss';

function AddPersonUI({ callback }) {
  return (
    <div className="add-person-ui">
      <div className="add-person-ui-input-container">
        <input type="text" className="add-person-ui-input-container__name" />
        <input
          type="date"
          className="add-person-ui-input-container__birthday"
        />
      </div>
      <div className="add-person-ui-controls">
        <button
          className="add-person-ui-controls__add-btn"
          onClick={() => {
            callback();
          }}
        >
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default AddPersonUI;
