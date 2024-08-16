import { useEffect, useState } from "react";
import "./index.css";
const api = process.env.REACT_APP_RECIPE_API;

function App() {
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState();
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

  function handleSelect(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
    console.log(id);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchRecipe();
  }

  ///////////////////////////////////////////////////
  return (
    <div className="App">
      <NavBar query={query} setQuery={setQuery} onSubmit={handleSubmit} />
      {isLoading ? (
        <h2>Loading...</h2>
      ) : selectedId ? (
        <DisplaySelected selectedId={selectedId} onSelect={handleSelect} />
      ) : (
        <Results results={results} onSelect={handleSelect} />
      )}
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

function Results({ results, onSelect }) {
  return (
    <div className="results">
      {results.length > 0 ? (
        results.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id} // Pass the id prop here
            img={recipe.image}
            title={recipe.title}
            onSelect={onSelect}
          />
        ))
      ) : (
        <p className="placeholder">Let's find something tasty! 😋</p>
      )}
    </div>
  );
}

function DisplaySelected({ selectedId, onSelect }) {
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    async function getRecipe() {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${selectedId}/information?apiKey=${api}`
        );
        const data = await res.json();
        if (data.Response === "False") throw new Error("Recipe not found");
        setRecipe(data);
      } catch (e) {
        console.log(e);
      }
    }

    if (selectedId) {
      getRecipe();
    }
  }, [selectedId]);

  const {
    cuisines,
    extendedIngredients: ingredients,
    image,
    instructions,
    readyInMinutes,
    title,
    summary,
  } = recipe;

  return (
    <div className="selected-recipe">
      <button onClick={() => onSelect(null)}>X</button>
      <img src={image} alt={title} />
      <h2>{title}</h2>
      <p className="summary" dangerouslySetInnerHTML={{ __html: summary }}></p>
      <p className="cuisine-time"><strong>Cuisine:</strong> {cuisines?.join(', ') || 'N/A'}</p>
      <p className="cooking-time"><strong>Cooking Time:</strong> {readyInMinutes} minutes</p>
      <h3>Ingredients:</h3>
      <ul>
        {ingredients?.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.original}</li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <p className="instructions" dangerouslySetInnerHTML={{ __html: instructions }}></p>
    </div>
  );
}


// function DisplaySelected({ selectedId, onSelect }) {
//   const [recipe, setRecipe] = useState({});

//   useEffect(() => {
//     async function getRecipe() {
//       try {
//         const res = await fetch(
//           `https://api.spoonacular.com/recipes/${selectedId}/information?apiKey=${api}`
//         );
//         const data = await res.json();
//         if (data.Response === "False") throw new Error("Recepie not found");
//         console.log(data);
//         setRecipe(data);
//       } catch (e) {
//         console.log(e);
//       }
//     }

//     if (selectedId) {
//       getRecipe();
//     }
//   }, [selectedId]);

//   const {
//     cuisines,
//     extendedIngredients: ingredients,
//     image,
//     instructions,
//     readyInMinutes,
//     title,
//     summary,
//   } = recipe;

//   return (
//     // <div className="display-selected">
//     //   <img src={recipe.img} alt="" />
//     //   <p>{recipe.title}</p>
//     // </div>
//     <div className="selected-recipe">
//       <img src={image} alt={title} />
//       <p>{title}</p>
//       <p>{summary}</p>
//       <button onClick={() => onSelect(null)}>X</button>
//     </div>
//   );
// }

function RecipeCard({ title, id, img, onSelect }) {
  return (
    <div className="recipe-card" id={id} onClick={() => onSelect(id)}>
      <img src={img} alt={title} />
      <h4>{title}</h4>
    </div>
  );
}

export default App;
