import { useEffect, useState } from "react";
import "./App.css";

/* images */
import IconDollar from "./assets/images/icon-dollar.svg";
import IconPerson from "./assets/images/icon-person.svg";

function App() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState("");
  const [people, setPeople] = useState("");
  const [activeTip, setActiveTip] = useState(false);
  const [customTip, setCustomTip] = useState("");
  const [resultTip, setResultTip] = useState("0.00");
  const [resultTotal, setResultTotal] = useState("0.00");
  const [incomplete, setIncomplete] = useState(true);

  const tipValues = [5, 10, 15, 25, 50];

  const createTipButtons = () => {
    const arr = Array(tipValues.length);

    for (let i = 0; i < tipValues.length; i++) {
      arr[i] = (
        <div
          tabIndex="0"
          key={`tipButton${i}`}
          className={
            "tip-button" +
            (Number(tip) === tipValues[i] ? " highlight-button" : "")
          }
          value={tipValues[i]}
          onClick={() => handleTip(tipValues[i])}
        >
          {`${tipValues[i]}%`}
        </div>
      );
    }

    return arr;
  };

  const blockInvalidChar = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const blockInvalidChar_Integer = (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleCustomTip = (val) => {
    // prevent spamming of 0's
    if (val !== "" && Number(val) === 0) {
      setCustomTip("0");
      return;
    }

    // check for max value
    if (val > 100) {
      val = 100;
    }

    setTip(val);
    setActiveTip(false);
    setCustomTip(val);
  };

  const handleBill = (val) => {
    // no input -> do nothing
    if (val === "") {
      setBill("");
      return;
    }

    // prevent spamming of 0's
    if (Number(val) === 0) {
      setBill("0");
      return;
    }

    // max number: 10^7 - 1
    if (Number(val) >= 999999.99) {
      setBill(999999.99);
      return;
    }

    // there exists some valid numbers
    const res = Math.round(Number(val) * 100) / 100;
    setBill(res);
  };

  const handleTip = (val) => {
    setTip(val);
    setActiveTip(true);
    setCustomTip("");
  };

  const handlePeople = (val) => {
    // empty value
    if (val === "") {
      setPeople("");
      return;
    }

    // prevent spamming of 0's
    if (Number(val) === 0) {
      setPeople("0");
      return;
    }

    // max number: 10^7 - 1
    if (Number(val) >= 999999) {
      setPeople(999999);
      return;
    }

    setPeople(val);
  };

  const handleReset = () => {
    // reset all states
    setBill("");
    setTip("");
    setActiveTip(false);
    setPeople("");
    setCustomTip("");
    setResultTip("0.00");
    setResultTotal("0.00");
  };

  // update the total based on inputs -> check if all inputs are valid
  useEffect(() => {
    // skip if any number is not filled
    if (bill === "" || tip === "" || people === "") {
      if (!incomplete) {
        setIncomplete(true);
      }

      if (resultTip !== "0.00") {
        setResultTip("0.00");
      }

      if (resultTotal !== "0.00") {
        setResultTotal("0.00");
      }
      return;
    }

    // calculate
    const tipAmount = bill * (tip / 100);
    const tipPerPerson = Math.round((tipAmount / people) * 100) / 100;

    const total = bill + tipAmount;
    const totalPerPerson = Math.round((total / people) * 100) / 100;

    setResultTip(tipPerPerson.toFixed(2));
    setResultTotal(totalPerPerson.toFixed(2));
    setIncomplete(false);
  }, [bill, tip, people]);

  return (
    <>
      <header>
        <h1>spli</h1>
        <h1>tter</h1>
      </header>
      <main>
        <form>
          <div className="bill-container input-container">
            <div className="input-text-container">
              <label htmlFor="bill-input">Bill</label>
            </div>
            <input
              id="bill-input"
              type="number"
              placeholder="0"
              value={bill}
              onKeyDown={blockInvalidChar}
              onChange={(e) => handleBill(e.target.value)}
            ></input>
            <img
              className="icon-dollar input-icon"
              src={IconDollar}
              alt="icon dollar sign"
            ></img>
          </div>
          <div>
            <div className="input-text-container">
              <label htmlFor="tip-grid">Select Tip %</label>
            </div>
            <div id="tip-grid" className="tip-grid-container">
              {createTipButtons()}
              <input
                className={
                  "custom-tip-input" +
                  (!activeTip && tip !== "" ? " highlight-custom-tip" : "")
                }
                type="number"
                placeholder="Custom"
                value={customTip}
                onKeyDown={blockInvalidChar}
                onChange={(e) => handleCustomTip(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="number-of-people-container input-container">
            <div className="input-text-container">
              <label htmlFor="number-of-people">Number of People</label>
              {people === "0" ? (
                <label className="error-label">Can't be zero</label>
              ) : null}
            </div>
            <input
              id="number-of-people"
              type="number"
              placeholder="0"
              onKeyDown={blockInvalidChar_Integer}
              value={people}
              onChange={(e) => handlePeople(e.target.value)}
            ></input>
            <img
              className="icon-people input-icon"
              src={IconPerson}
              alt="icon people"
            ></img>
          </div>
        </form>
        <section className="results-section">
          <div className="results-container">
            <div className="single-result-container">
              <div className="result-text-container">
                <div className="result-title">Tip Amount</div>
                <div className="result-person-text">/ person</div>
              </div>
              <div className="result-amount">${resultTip}</div>
            </div>
            <div className="single-result-container">
              <div className="result-text-container">
                <div className="result-title">Total</div>
                <div className="result-person-text">/ person</div>
              </div>
              <div className="result-amount">${resultTotal}</div>
            </div>
          </div>
          <button
            className={
              "reset-button" + (incomplete ? " reset-button-empty" : "")
            }
            onClick={handleReset}
          >
            RESET
          </button>
        </section>
      </main>
      <footer className="attribution">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a href="https://github.com/exchyphen" target="_blank">
          exc
        </a>
        .
      </footer>
    </>
  );
}

export default App;
