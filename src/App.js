import React from 'react';
import { createStore } from 'redux';

const CHANGE = "change";

function temperature(_, { type, value, activeScale }) {

  const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

  const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  switch (type) {
    case CHANGE:

      const temp = parseFloat(value);

      const c = activeScale === "c" ? value : (isNaN(temp) ? "" : toCelsius(temp));

      const f = activeScale === "f" ? value : (isNaN(temp) ? "" : toFahrenheit(temp));

      return {celsius: c, fahrenheit: f};
    default:
      return {celsius : "", fahrenheit : ""};
  }
}

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit",
};

const TemperatureInput = ({ store, scale }) => {

  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input value={scale === "c" ? store.getState().celsius : store.getState().fahrenheit}
        onInput={(e) => store.dispatch({type: CHANGE, value: e.currentTarget.value, activeScale: scale})}
      />
    </fieldset>
  );
};

const BoilingVerdict = ({ store }) => {

  if (isNaN(parseFloat(store.getState().celsius))) {
    return "";
  }

  const notOrEmptyString = store.getState().celsius < 100 ? "not" : "";

  return `The water would ${notOrEmptyString} boil`;
};

const store = createStore(temperature);

const Calculator = { App: () => (
  <div>
    <TemperatureInput store={store} scale="c" />
    <TemperatureInput store={store} scale="f" />
    <BoilingVerdict store={store} />
  </div>
),
store: store};


export default Calculator;
