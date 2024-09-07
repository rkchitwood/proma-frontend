import { useState, useEffect } from "react";

/** Custom hook for keeping state data synced with localStorage.
 * 
 * This creates an item as state and looks in localStorage for current value
 * If not in localStorage, defaults to firstValue.
 * 
 * When item changes, effect re-runs:
 *  - if null, removes from localStorage
 *  - otherwise updates localStorage
 * 
 * Acts just like state to a component but is also synced to and
 * from localStorage
 */
function useLocalStorage(key, firstValue = null) {
    const initialValue = localStorage.getItem(key) || firstValue;
    const [item, setItem] = useState(initialValue);

    useEffect(function setKeyInLocalStorage() {
        if (item === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, item);
        }
    }, [key, item]);
    return [item, setItem];
}

export default useLocalStorage;