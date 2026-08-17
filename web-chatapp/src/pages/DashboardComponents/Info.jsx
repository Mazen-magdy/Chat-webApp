import { useContext } from "react";
import { userData, screenSt } from "../../contexts";

import closeIcon from "../../utilities/leftArrow.svg";

export default function Info({ infoSection }) {
  const userInfo = useContext(userData);
  const { screenState, setScreenState } = useContext(screenSt);

  const handleClose = () => {
    infoSection.current.style.display = 'none';
    setScreenState(0); // Go back to contacts
  };

  return (
    <section id="info" ref={infoSection}>
      <div className="info-container">
        <div className="info-header">
          <h2>Profile</h2>
          <img
            src={closeIcon}
            alt="close"
            className="close-btn"
            onClick={handleClose}
          />
        </div>

        <div className="info-content">
          <div className="profile-image">
            <img src={userInfo?.imageUrl} alt="profile" />
          </div>

          <div className="info-details">
            <div className="info-item">
              <label>Name</label>
              <p>{userInfo?.name}</p>
            </div>

            <div className="info-item">
              <label>Phone</label>
              <p>{userInfo?.phoneNumber}</p>
            </div>

            <div className="info-item">
              <label>Email</label>
              <p>{userInfo?.email || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
