import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DashReactButton extends Component {
  constructor(props) {
    super(props);
    this.disableButton = this.disableButton.bind(this);
  }

  disableButton() {
    this.props.setProps({
      disabled: true
    });
  }

  render() {
    return (
      <button
        onClick={this.disableButton}
        {...this.props}
      >
        {this.props.children}
      </button>
    );
  }
}

DashReactButton.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.string
};

export default DashReactButton;