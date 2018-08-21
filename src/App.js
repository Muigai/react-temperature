import React from 'react';

const scaleNames = {
  c: "Celsius",
  f: "Fahrenheit",
};

class TemperatureInput extends React.Component {

  static temperatureChanged = "temperaturechanged";

  toCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

  toFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  isActiveInput = true;

  getTemperature = () => this.isActiveInput ? this.state.temperature :
                         isNaN(this.state.temperature) ? "" : this.state.temperature.toString();

  publishTemperatureChanged =
    (s) => {

      this.setState({ temperature: s});

      const temp = parseFloat(s);

      const data = {
        celsius: this.props.scale === "c" ? temp : this.toCelsius(temp),
        fahrenheit: this.props.scale === "f" ? temp : this.toFahrenheit(temp),
        sourceScale: this.props.scale,
      };

      publish(TemperatureInput.temperatureChanged, data);
    };

  onTemperatureChanged = (e) => {
    if (this.props.scale !== e.sourceScale) {
      this.isActiveInput = false;
      this.setState({ temperature: this.props.scale === "c" ? e.celsius : e.fahrenheit });
    }
    else{
      this.isActiveInput = true;
    }
  };

  render = () => (
    <fieldset>
      <legend>Enter temperature in {scaleNames[this.props.scale]}:</legend>
      <input value={this.getTemperature()} onInput={(e) => this.publishTemperatureChanged(e.currentTarget.value)} />
    </fieldset>
  );

  constructor(props) {
    super(props);
    this.state = { temperature: "" };
    subscribe(TemperatureInput.temperatureChanged, this.onTemperatureChanged);
  }
}

class BoilingVerdict extends React.Component {

  onTemperatureChanged = (e) => {

    if (isNaN(e.celsius)) {
      this.setState({ verdict: '' });
      return;
    }

    const notOrEmptyString = e.celsius < 100 ? "not" : "";

    this.setState({ verdict: `The water would ${notOrEmptyString} boil` });
  };

  render = () => this.state.verdict;

  constructor(props) {
    super(props);
    this.state = { verdict: '' };
    subscribe(TemperatureInput.eventName, this.onTemperatureChanged);
  }
}

const Calculator = () => (
  <div>
    <TemperatureInput scale="c" />
    <TemperatureInput scale="f" />
    <BoilingVerdict />
  </div>
);

const customEvents = new Map();

const publish = (eventName, data) => {

  const listeners = customEvents.get(eventName);

  const _ = listeners && listeners.forEach((a) => a(data));
};

const subscribe = (customEventName, listener) => {

  if (!customEvents.has(customEventName)) {
    customEvents.set(customEventName, []);
  }

  const handlers = customEvents.get(customEventName);

  handlers.push(listener);
};

export default Calculator;
