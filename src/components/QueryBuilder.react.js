/* eslint-disable import/named */
/* eslint-disable import/no-deprecated */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stringify from 'json-stringify-safe';
import transit from 'transit-immutable-js';
import { Query, Builder, Utils as QbUtils } from '../packages/react-awesome-query-builder';
import config from './QueryBuilder.config';

import '../../src/packages/react-awesome-query-builder/css/styles.scss';
import '../../src/packages/react-awesome-query-builder/css/compact_styles.scss';
import '../../src/packages/react-awesome-query-builder/css/denormalize.scss';

const { queryBuilderFormat } = QbUtils;

export default class QueryBuilder extends Component {
  getChildren(props) {
    const jsonStyle = {
      backgroundColor: 'darkgrey',
      margin: '10px',
      padding: '10px'
    }
    return (
      <div style={{ padding: '10px' }}>
        <div className="query-builder">
          <Builder {...props} />
        </div>
        <br />
        <div>
          queryBuilderFormat:
          <pre style={jsonStyle}>
            {stringify(queryBuilderFormat(props.tree, props.config), undefined, 2)}
          </pre>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Query
          {...config}
          value={transit.fromJSON(this.props.value)}
          get_children={this.getChildren}
        ></Query>
      </div>
    );
  }
}

QueryBuilder.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  setProps: PropTypes.func
};