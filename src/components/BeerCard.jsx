import React, { useState } from 'react';
import './beer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const BeerCard = ({ beer, onToggleFavorite }) => {
  const { name, description, image_url } = beer;
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };


  const displayDescription = showFullDescription ? description : description.slice(0, 200);

  return (
    <section className="wrap">
      <div className="beerCard card">
        <div className="row no-gutters cardwrap mb-2">
          <div className="col-lg-4 col-md-6">
            <img src={image_url} className="cardImg" alt={name} />
          </div>
          <div className="col-lg-8">
            <div className="cardBody">
              <h5 className="cardTitle">{name}</h5>
              <p className="cardText">{displayDescription}</p>
              {description.length > 100 && (
                <button className="btn btn-link" onClick={toggleDescription}>
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              )}
              <button
                onClick={() => onToggleFavorite(beer)}
                className={`btn ${beer.isFavorite ? 'btnWarning' : 'btnOutlineWarning'}`}
              >
                {beer.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeerCard;
