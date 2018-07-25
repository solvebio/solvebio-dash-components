import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DashReactButton extends Component {
  constructor(props) {
    super(props);
    this.disableButton = this.disableButton.bind(this);
  }

  disableButton() {
    this.props.setProps({
      disabled: true,
      n_clicks: this.props.n_clicks + 1
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
  disabled: PropTypes.string,
  n_clicks: PropTypes.integer
};

DashReactButton.defaultProps = {
  n_clicks: 0
}

export default DashReactButton;