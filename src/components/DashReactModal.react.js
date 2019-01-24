import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';

class DashReactModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleCloseModal() {
    this.props.setProps({
      openSwitch: false,
      closeSwitch: false
    });
  }

  render() {
    const modalHeight = this.state.height * 0.8;
    return (
      <div>
        <ReactModal
          // XOR implementation to accomodate Dash callback pattern
          isOpen={this.props.openSwitch ? !this.props.closeSwitch : this.props.closeSwitch}
          ariaHideApp={false}
          onRequestClose={this.handleCloseModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '0px',
              height: `${modalHeight}px`
            }
          }}
          {...this.props}
        >
          {this.props.children}
        </ReactModal>
      </div>
    );
  }
}

DashReactModal.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  openSwitch: PropTypes.bool,
  closeSwitch: PropTypes.bool
};

DashReactModal.defaultProps = {
  openSwitch: false,
  closeSwitch: false
};

export default DashReactModal;