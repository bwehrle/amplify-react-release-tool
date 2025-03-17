import React from 'react';

interface AddReleasePopupProps {
  newRelease: {
    releaseDate: string;
    releaseTitle: string;
    releaseBranch: string;
    preStagingEnv: string;
    currentState: string;
    releaseManager: string;
    qaPrime: string;
  };
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closePopup: () => void;
}

const AddReleasePopup: React.FC<AddReleasePopupProps> = ({ newRelease, handleInputChange, handleSubmit, closePopup }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Add New Release</h2>
        <form>
          <div>
            <label>Release Date</label>
            <input type="text" name="releaseDate" value={newRelease.releaseDate} onChange={handleInputChange} />
          </div>
          <div>
            <label>Release Title</label>
            <input type="text" name="releaseTitle" value={newRelease.releaseTitle} onChange={handleInputChange} />
          </div>
          <div>
            <label>Release Branch</label>
            <input type="text" name="releaseBranch" value={newRelease.releaseBranch} onChange={handleInputChange} />
          </div>
          <div>
            <label>Pre Staging Env</label>
            <input type="text" name="preStagingEnv" value={newRelease.preStagingEnv} onChange={handleInputChange} />
          </div>
          <div>
            <label>Current State</label>
            <input type="text" name="currentState" value={newRelease.currentState} onChange={handleInputChange} />
          </div>
          <div>
            <label>Release Manager</label>
            <input type="text" name="releaseManager" value={newRelease.releaseManager} onChange={handleInputChange} />
          </div>
          <div>
            <label>QA Prime</label>
            <input type="text" name="qaPrime" value={newRelease.qaPrime} onChange={handleInputChange} />
          </div>
          <button type="button" onClick={handleSubmit}>Submit</button>
          <button type="button" onClick={closePopup}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default AddReleasePopup;
