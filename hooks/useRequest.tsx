

import { useCallback, useState } from 'react';
import { Request } from "./RequestClass";

function useRequest(request) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async () => {
    setLoading(true);
    try {
      const result = await request.send();
      return result;
    } catch (err) {
      setError({
        message: err.response?.data?.message || err.message,
        code: err.response?.status || 500
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [request]);

  return { send, loading, error };
}

export { useRequest };
