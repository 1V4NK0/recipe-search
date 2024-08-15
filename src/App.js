import { useState } from "react";
import "./index.css";

function App() {
  const api = process.env.REACT_APP_RECIPE_API;
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({});
  /////////////////////////////////////////////////

  async function fetchRecipe() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${api}`
      );
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      const data = await response.json();
      setResults(data.results);
      setLoading(false);
      console.log(results);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchRecipe();
  }

  ///////////////////////////////////////////////////
  return (
    <div className="App">
      <NavBar query={query} setQuery={setQuery} onSubmit={handleSubmit} />
      {isLoading ? <h2>Loading...</h2> : <Results results={results} />}
    </div>
  );
}

function Search({ query, setQuery, onSubmit }) {
  //ON SUBMIT
  return (
    <form className="search-container" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="yummy!"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button>Search</button>
    </form>
  );
}

function NavBar({ query, setQuery, onSubmit }) {
  return (
    <div className="navbar">
      <div className="logo">
        <span>🥘</span> Recipe Radar
      </div>
      <Search query={query} setQuery={setQuery} onSubmit={onSubmit} />
    </div>
  );
}

function Results({ results }) {
  return (
    <div className="results">
      {results.length > 0 ? (
        //should be recipe card element
        results.map((recipe, index) => (
          <RecipeCard
            key={results[index].id}
            img={results[index].image}
            title={results[index].title}
          />
        ))
      ) : (
        <p className="placeholder">Let's find something tasty! 😋</p>
      )}
    </div>
  );
}

function RecipeCard({ title, id, img }) {
  return (
    <div className="recipe-card" id={id}>
      <img src={img} alt={title} />
      <h4>{title}</h4>
    </div>
  );
}

export default App;
