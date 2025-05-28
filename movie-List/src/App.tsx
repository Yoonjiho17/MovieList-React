/// <reference types="vite/client" />
import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`);
      if (!response.ok) throw new Error("네트워크 응답 실패");

      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("TMDB API 호출 오류:", error);
    }
  };

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setSelectedMovie(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="app">
      <h3>Movie List</h3>
      <div className="movie-list">
        {movies.map((movie) => (
          <button 
            className="movie-card" 
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <p className="movieTitle">{movie.title}</p>
            <p className="rating">⭐ {movie.vote_average.toFixed(1)}</p>
          </button>
        ))}
      </div>

      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedMovie(null)}>x</button>
            <div className="modal-content">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
              />
              <div className="modal-content-text">
                <h2>{selectedMovie.title}</h2>
                <p><strong>개봉일:</strong> {selectedMovie.release_date}</p>
                <p><strong>평점:</strong> ⭐{selectedMovie.vote_average.toFixed(1)}</p>
                <p><strong>줄거리:</strong> {selectedMovie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

