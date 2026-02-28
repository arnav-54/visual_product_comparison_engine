import { useEffect } from "react";
import { search } from "./search";

function App() {

  useEffect(() => {
    console.log("🚀 Testing Search Engine...");

    const mockQuery = [0.12, 0.45, -0.33, 0.88];

    const results = search(mockQuery, 3);

    console.log("Results:", results);
  }, []);

  return (
    <div>
      <h1>Search Engine Test</h1>
      <p>Open console to see results</p>
    </div>
  );
}

export default App;