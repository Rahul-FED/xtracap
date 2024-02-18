import React, { useEffect, useState } from 'react';
import './Favourite.css';

const Favorites = ({ favorites, onRemoveFavorite }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    onInitializeFavorites(storedFavorites);
  }, []);

  const onInitializeFavorites = (initialFavorites) => {
  };

  const handleRemoveFavorite = (beerId) => {
    setIsRemoving(true);

    setTimeout(() => {
      onRemoveFavorite(beerId);
      setIsRemoving(false);
    }, 300);
  };

  return (
    <section>
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorite beers yet.</p>
      ) : (
        favorites.map((beer) => (
          <div key={beer.id} className={`favorite-card ${isRemoving ? 'removing' : ''}`}>
            <img src={beer.image_url} alt={beer.name} style={{ width: '50px', height: 'auto' }} />
            <p>{beer.name}</p>
            <button className='btn btn-secondary' onClick={() => handleRemoveFavorite(beer.id)}>Remove from Favorites</button>
          </div>
        ))
      )}
    </section>
  );
};

export default Favorites;
