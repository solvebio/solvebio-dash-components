import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { OncoPrint } from 'react-oncoprint';

class DashOncoPrint extends Component {
    render() {
      const data = JSON.parse(this.props.data);

      return <OncoPrint data={data}/>;
    }
}

DashOncoPrint.propTypes = {
    id: PropTypes.string,
    data: PropTypes.string
};

export default DashOncoPrint;
