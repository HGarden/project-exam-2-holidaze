import { useState, useEffect } from 'react';

function useApi(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [url]);

return { data, loading, error };

}

export default useApi;


