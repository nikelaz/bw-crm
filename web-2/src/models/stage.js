import capitalizeFirstLetter from "../helpers/capitalize-first-letter";

class Stage {
  constructor(label, value) {
    this.label = label;
    this.value = value;
  }

  static fromValue(value) {
    return new Stage(
      capitalizeFirstLetter(value),
      value
    );
  }
}

export default Stage;
