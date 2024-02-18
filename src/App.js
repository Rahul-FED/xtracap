import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import axios from 'axios';
import BeerCard from './components/BeerCard';
import Favorites from './components/Favorites';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './images/xtracap.png'

const Home = ({ beers, handleSearch, handleToggleFavorite, fetchBeers, addToFavorites }) => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchMoreBeers = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetchBeers().then(() => setIsFetching(false));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        fetchMoreBeers();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchMoreBeers]);

  return (
    <section className="wrap">
      <div>
        <div className="my-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search for beers"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="row">
          {beers.map((beer) => (
            <div key={beer.id} className="col-md-6">
              <BeerCard
                beer={beer}
                onToggleFavorite={handleToggleFavorite}
                onAddToFavorites={() => addToFavorites(beer)}
              />
            </div>
          ))}
        </div>
        {isFetching && <p>Loading more beers...</p>}
      </div>
    </section>
  );
};

const App = () => {
  const [beers, setBeers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBeers();
  }, [page]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []); 

  const fetchBeers = async () => {
    try {
      const response = await axios.get(
        `https://api.punkapi.com/v2/beers?beer_name=${searchTerm}&per_page=10&page=${page}`
      );
      setBeers((prevBeers) => [
        ...prevBeers,
        ...response.data.map((beer) => ({ ...beer, isFavorite: favorites.some((favBeer) => favBeer.id === beer.id) })),
      ]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching beers:', error);
    }
  };

  const handleSearch = (query) => {
    setBeers([]);
    setSearchTerm(query);
    setPage(1);
    fetchBeers();
  };

  const handleToggleFavorite = (beer) => {
    const updatedBeers = beers.map((b) => (b.id === beer.id ? { ...b, isFavorite: !b.isFavorite } : b));
    setBeers(updatedBeers);

    const isFavorite = favorites.some((favBeer) => favBeer.id === beer.id);
    if (isFavorite) {
      setFavorites((prevFavorites) => prevFavorites.filter((favBeer) => favBeer.id !== beer.id));
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, beer]);
    }

    localStorage.setItem('favorites', JSON.stringify([...favorites, beer]));
  };

  const handleRemoveFavorite = (beerId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((favBeer) => favBeer.id !== beerId));

    localStorage.setItem('favorites', JSON.stringify(favorites.filter((favBeer) => favBeer.id !== beerId)));
  };

  const addToFavorites = (beer) => {
    if (!favorites.some((favBeer) => favBeer.id === beer.id)) {
      const updatedFavorites = [...favorites, beer];
      setFavorites(updatedFavorites);

      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  return (
    <Router>
      <section >
      <div className='d-flex bg-dark'>
      <img src={logo} alt="" />
      </div>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light ">
            <Link className="navbar-brand" to="/">
              Beer App
            </Link>
            <div className="">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/favorites">
                    Favorites
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  beers={beers}
                  handleSearch={handleSearch}
                  handleToggleFavorite={handleToggleFavorite}
                  fetchBeers={fetchBeers}
                  addToFavorites={addToFavorites}
                />
              }
            />
            <Route path="/favorites" element={<Favorites favorites={favorites} onRemoveFavorite={handleRemoveFavorite} />} />
          </Routes>
        </div>
      </section>
    </Router>
  );
};

export default App;
