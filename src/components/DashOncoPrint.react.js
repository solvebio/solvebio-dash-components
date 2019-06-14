import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { OncoPrint } from 'react-oncoprint';
import { OncoPrint } from '../packages/react-oncoprint/src';

class DashOncoPrint extends Component {
  render() {
    const data = JSON.parse(this.props.data);
    const height = this.props.height || 500;
    const nSamples = this.props.nSamples;
    const vardictId = this.props.vardictId;
    const vardictFilters = this.props.vardictFilters;
    const seq2cId = this.props.seq2cId;
    const seq2cFilters = this.props.seq2cFilters;

    return <OncoPrint
      data={data}
      height={height}
      nSamples={nSamples}
      vardictId={vardictId}
      vardictFilters={vardictFilters}
      seq2cId={seq2cId}
      seq2cFilters={seq2cFilters}
    />;
  }
}

DashOncoPrint.propTypes = {
  id: PropTypes.string,
  data: PropTypes.string,
  height: PropTypes.number,
  nSamples: PropTypes.number,
  vardictId: PropTypes.string,
  vardictFilters: PropTypes.string,
  seq2cId: PropTypes.string,
  seq2cFilters: PropTypes.string
};

export default DashOncoPrint;
