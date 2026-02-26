import { useEffect } from "react";

export function storeLocally(dataName, data) {
  useEffect(() => {
    if (data) {
      localStorage.setItem(dataName, data);
    } else {
      localStorage.removeItem(dataName);
    }
  }, [data]);
}
