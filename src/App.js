import { decorate, observable } from "mobx";
import {observer} from "mobx-react";
import React from 'react';

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit",
};

class TemperatureStore {
  celsius = "";
  fahrenheit = "";
}

decorate(TemperatureStore, {
  celsius: observable,
  fahrenheit: observable
});

const temperature = new TemperatureStore();

const TemperatureInput = observer(({ scale }) => {

  const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

  const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  const temperatureChanged =
    (s) => {

      const temp = parseFloat(s);

      temperature.celsius = scale === "c" ? s : (isNaN(temp) ? "" : toCelsius(temp));

      temperature.fahrenheit = scale === "f" ? s : (isNaN(temp) ? "" : toFahrenheit(temp));
    };

  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input value={scale === "c" ? temperature.celsius : temperature.fahrenheit}
        onInput={(e) => temperatureChanged(e.currentTarget.value)}
      />
    </fieldset>
  );
}
);

const BoilingVerdict = observer(() => {

  if (isNaN(parseFloat(temperature.celsius))) {
    return "";
  }

  const notOrEmptyString = temperature.celsius < 100 ? "not" : "";

  return `The water would ${notOrEmptyString} boil`;
}
)

const Calculator = () => (
  <div>
    <TemperatureInput scale="c" />
    <TemperatureInput  scale="f" />
    <BoilingVerdict />
  </div>
)

export default Calculator;