import EventEmitter from 'events';
import React from 'react';

const emitter = new EventEmitter();

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit",
};

const toCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

const toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

const temperatureChanged = "temperaturechanged";

class TemperatureInput extends React.Component {

  publishTemperatureChanged =
    (s) => {

      const data = {
        value: s,
        sourceScale: this.props.scale,
      };

      emitter.emit(temperatureChanged, data);
    };

  onTemperatureChanged = (e) => {

    const scale = this.props.scale;

    const temp = parseFloat(e.value);

    let temperature =
      (() => {
        if (scale !== e.sourceScale) {
          return isNaN(temp) ? "" : (scale === "c" ? toCelsius(temp) : toFahrenheit(temp))
        }
        else {
          return e.value;
        }
      })();

    this.setState({temperature});
  };

  render = () => (
    <fieldset>
      <legend>Enter temperature in {scaleNames[this.props.scale]}:</legend>
      <input value={this.state.temperature} onInput={(e) => this.publishTemperatureChanged(e.currentTarget.value)} />
    </fieldset>
  );

  constructor(props) {
    super(props);
    this.state = { temperature: "" };
    emitter.addListener(temperatureChanged, this.onTemperatureChanged);
  }
}

class BoilingVerdict extends React.Component {

  onTemperatureChanged = (e) => {

    const temp = parseFloat(e.value);
    
    if (isNaN(temp)) {
      this.setState({ verdict: '' });
      return;
    }

    const temperature = e.sourceScale === "c" ? e.value : toCelsius(e.value);

    const notOrEmptyString = temperature < 100 ? "not" : "";

    this.setState({ verdict: `The water would ${notOrEmptyString} boil` });
  };

  render = () => this.state.verdict;

  constructor(props) {
    super(props);
    this.state = { verdict: '' };
    emitter.addListener(temperatureChanged, this.onTemperatureChanged);
  }
}

const Calculator = () => (
  <div>
    <TemperatureInput scale="c" />
    <TemperatureInput scale="f" />
    <BoilingVerdict />
  </div>
);

export default Calculator;
