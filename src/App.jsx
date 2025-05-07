import { useState, useCallback, useEffect, useRef } from "react";

const App = () => {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharacterAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState("Copy");

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let password = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*()_+~[]{}|;:,.<>?";

    for (let i = 1; i < length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      password += str.charAt(char);
    }
    setPassword(password);
  }, [length, numberAllowed, characterAllowed, setPassword]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    setCopied("Copied!");
    window.navigator.clipboard.writeText(password);

    setTimeout(() => {
      setCopied("Copy");
      window.getSelection().removeAllRanges();
    }, 2000);
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, characterAllowed, passwordGenerator]);

  return (
    <>
      <div className="md:w-full max-w-md md:mx-auto shadow-md rounded-lg px-6 my-8 py-3 mx-3 text-orange-500 bg-gray-800">
        <h1 className="text-center text-white pb-3">Password generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition rounded-l-none"
            onClick={copyPasswordToClipboard}
          >
            {copied}
          </button>
        </div>
        <div className="md:flex text-sm gap-x-2">
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
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => {
                setNumberAllowed(!numberAllowed);
              }}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={characterAllowed}
              id="characterInput"
              onChange={() => {
                setCharacterAllowed(!characterAllowed);
              }}
            />
            <label htmlFor="characterInput">characters</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
