import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { OncoPrint } from 'react-oncoprint';
import { OncoPrint } from '../packages/react-oncoprint/src';

class DashOncoPrint extends Component {
  render() {
    const data = JSON.parse(this.props.data);
    const height = this.props.height || 500;

    return <OncoPrint
        data={data}
        height={height}
      />;
  }
}

DashOncoPrint.propTypes = {
  id: PropTypes.string,
  data: PropTypes.string,
  height: PropTypes.number
};

export default DashOncoPrint;
