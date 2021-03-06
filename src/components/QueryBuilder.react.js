/* eslint-disable import/named */
/* eslint-disable import/no-deprecated */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stringify from 'json-stringify-safe';
import transit from 'transit-immutable-js';
import URLSafeBase64 from 'urlsafe-base64';
import { Query, Builder, Utils as QbUtils } from '../packages/react-awesome-query-builder';
import config from './QueryBuilder.config';

import '../packages/react-awesome-query-builder/css/styles.scss';
import '../packages/react-awesome-query-builder/css/compact_styles.scss';
import '../packages/react-awesome-query-builder/css/denormalize.scss';

const { queryBuilderFormat } = QbUtils;

export default class QueryBuilder extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  getChildren(props) {
    // const tree = queryBuilderFormat(props.tree, props.config);
    // const selectedFilters = tree ? stringify([{ and: tree }], undefined, 2) : '';
    return (
      // <div style={{ padding: '10px' }}>
      //   <div>GUI-based filter builder:</div>
        // <div className="query-builder">
          <Builder {...props} />
        // </div>
      //   <div>Selected Filters:</div>
      //   <textarea
      //     value={selectedFilters}
      //     style={{ margin: '10px', width: '95%', height: '100px' }}
      //   />
      // </div>
    );
  }

  onChange(tree) {
    const treeJSON = transit.toJSON(tree);
    const nestedFilter = JSON.stringify({
        filters: [{type: 'nested', nested: queryBuilderFormat(tree, config)}],
        query: '',
        summaryFields: [],
        tableFields: []
      });
    const encodedFilters = URLSafeBase64.encode(btoa(nestedFilter));
    // if statement required because of possible race condition
    // Component is loaded before Dash passes component setProps
    if (this.props.setProps) {
      this.props.setProps({
        filters: stringify(queryBuilderFormat(tree, config), undefined, 2),
        encodedFilters: encodedFilters,
        value: treeJSON
      });
    }
  }

  render() {
    const fields = { fields: JSON.parse(this.props.fields) };
    Object.assign(config, fields);

    return (
      <div>
        <Query
          {...config}
          value={transit.fromJSON(this.props.value)}
          onChange={this.onChange}
          get_children={this.getChildren}
        ></Query>
      </div>
    );
  }
}

QueryBuilder.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  filters: PropTypes.string,
  fields: PropTypes.string,
  setProps: PropTypes.func
};