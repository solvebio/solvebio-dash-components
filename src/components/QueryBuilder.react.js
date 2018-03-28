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
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  getChildren(props) {
    return (
      <div style={{ padding: '10px' }}>
        <div>GUI-based filter builder: </div>
        <div className="query-builder">
          <Builder {...props} />
        </div>
      </div>
    )
  }

  onChange(tree) {
    const treeJSON = transit.toJSON(tree);
    this.props.setProps({
      filters: stringify(queryBuilderFormat(tree, config), undefined, 2),
      value: treeJSON
    })
  }

  render() {
    return (
      <div>
        <Query
          {...config}
          get_children={this.getChildren}
          onChange={this.onChange}
          value={transit.fromJSON(this.props.value)}
        ></Query>
      </div>
    );
  }
}

QueryBuilder.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  filters: PropTypes.string,
  setProps: PropTypes.func
};