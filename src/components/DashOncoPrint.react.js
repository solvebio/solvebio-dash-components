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
    const vardictUrl = this.props.vardictUrl;
    const seq2cId = this.props.seq2cId;
    const seq2cUrl = this.props.seq2cUrl;

    return <OncoPrint
      data={data}
      height={height}
      nSamples={nSamples}
      vardictId={vardictId}
      vardictUrl={vardictUrl}
      seq2cId={seq2cId}
      seq2cUrl={seq2cUrl}
    />;
  }
}

DashOncoPrint.propTypes = {
  id: PropTypes.string,
  data: PropTypes.string,
  height: PropTypes.number,
  nSamples: PropTypes.number,
  vardictId: PropTypes.string,
  vardictUrl: PropTypes.string,
  seq2cId: PropTypes.string,
  seq2cUrl: PropTypes.string
};

export default DashOncoPrint;
