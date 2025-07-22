import { useState, useCallback, useEffect, useRef } from "react";

const App = () => {
  // useState to track password length (slider input)
  const [length, setLength] = useState(8);

  // useState to track if numbers are allowed in password
  const [numberAllowed, setNumberAllowed] = useState(false);

  // useState to track if special characters are allowed in password
  const [characterAllowed, setCharacterAllowed] = useState(false);

  // useState to store the generated password
  const [password, setPassword] = useState("");

  // useState to track the copy button label (Copy / Copied!)
  const [copied, setCopied] = useState("Copy");

  // useRef to access the password input field in the DOM
  // Accessing DOM elements (like document.getElementById)
  // React doesn’t recommend direct DOM manipulation, but sometimes it's necessary (e.g., focus input, scroll to element).
  const passwordRef = useRef(null);

  // useCallback: Creates a memoized function to generate password
  // ✅ If you use useCallback:
  // React will memoize (remember) the function.
  // It will only re-create the function when its dependencies change.
  // This avoids unnecessary re-renders or re-executions of useEffect.
  
  const passwordGenerator = useCallback(() => {
    let password = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789"; // Add numbers if allowed
    if (characterAllowed) str += "!@#$%^&*()_+~[]{}|;:,.<>?"; // Add special characters if allowed

    for (let i = 1; i < length; i++) {
      let char = Math.floor(Math.random() * str.length + 1); // Get a random index
      password += str.charAt(char); // Add that character to the password
    }

    setPassword(password); // Update password in state
  }, [length, numberAllowed, characterAllowed, setPassword]);

  // useCallback: Function to copy password to clipboard and show "Copied!" for 2 sec
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select(); // Select the input field
    passwordRef.current?.setSelectionRange(0, 999); // Select all text in it
    setCopied("Copied!"); // Change button text to "Copied!"
    window.navigator.clipboard.writeText(password); // Copy to clipboard

    // After 2 seconds, reset text to "Copy"
    setTimeout(() => {
      setCopied("Copy");
      window.getSelection().removeAllRanges(); // Unselect text
    }, 2000);
  }, [password]);

  // useEffect: Re-generate password every time dependencies change
  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, characterAllowed, passwordGenerator]);

  return (
    <>
      <div className="md:w-full max-w-md md:mx-auto shadow-md rounded-lg px-6 my-8 py-3 mx-3 text-orange-500 bg-gray-800">
        <h1 className="text-center text-white pb-3">Password generator</h1>

        {/* Password Display and Copy Button */}
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            ref={passwordRef} // Access using useRef
          />
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition rounded-l-none"
            onClick={copyPasswordToClipboard}
          >
            {copied}
          </button>
        </div>

        {/* Controls: Length Slider, Number/Character Checkboxes */}
        <div className="md:flex text-sm gap-x-2">
          {/* Password Length Range */}
          <div className="flex items-center gap-x-1">
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className="cursor-pointer"
              onChange={(e) => setLength(e.target.value)}
            />
            <label>Length : {length}</label>
          </div>

          {/* Numbers Allowed Toggle */}
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => setNumberAllowed(!numberAllowed)}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>

          {/* Characters Allowed Toggle */}
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={characterAllowed}
              id="characterInput"
              onChange={() => setCharacterAllowed(!characterAllowed)}
            />
            <label htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
