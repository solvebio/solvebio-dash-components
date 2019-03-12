import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Creatable } from 'react-select';

class DashReactSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: this.props.value
    };
    this.handleCreateOption = this.handleCreateOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleCreateOption(newValues) {
    let values = this.state.values.slice();
    newValues = newValues.trim();
    newValues = this.props.split ? newValues.split(/[ ,]+/) : [newValues];
    newValues.forEach(value => {
      if (value !== '') {
        values.push({
          label: value,
          value: value
        });
      }
    });
    this.setState({ values: values });
  }

  handleChange(newValues) {
    this.setState({ values: newValues });
  }

  render() {
    return <Creatable
      isMulti={this.props.isMulti}
      options={this.props.options}
      value={this.state.values}
      onChange={this.handleChange}
      onCreateOption={this.handleCreateOption}
    />;
  }
}

DashReactSelect.propTypes = {
  id: PropTypes.string,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  split: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    )
  ])
};

DashReactSelect.defaultProps = {
  isMulti: true,
  options: [],
  split: true,
  value: []
};

export default DashReactSelect;
