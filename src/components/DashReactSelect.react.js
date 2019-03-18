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

  componentWillReceiveProps(newProps) {
    if (this.props.value !== newProps.value) {
      this.setState({ values: newProps.value });
    }
  }

  handleCreateOption(newValues) {
    // Copy current state
    let values = this.state.values !== null ? this.state.values.slice() : [];
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
    this.props.setProps({ value: values });
  }

  handleChange(newValues) {
    this.setState({ values: newValues });
    this.props.setProps({ value: newValues });
  }

  render() {
    return (
      <Creatable
        formatCreateLabel={() => this.props.children}
        isMulti={this.props.isMulti}
        noOptionsMessage={() => null}
        onChange={this.handleChange}
        onCreateOption={this.handleCreateOption}
        options={this.props.options}
        placeholder={this.props.placeholder}
        value={this.state.values}
      />
    );
  }
}

DashReactSelect.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  placeholder: PropTypes.string,
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
  placeholder: 'Select...',
  split: true,
  value: []
};

export default DashReactSelect;
