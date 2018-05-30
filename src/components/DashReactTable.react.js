import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';

import 'react-table/react-table.css';

class DashReactTable extends Component {
  constructor(props) {
    super(props);
    this.state = { selected: null };
    this.getTrProps = this.getTrProps.bind(this);
    this.onSortedChange = this.onSortedChange.bind(this);
    this.styleRowBackground = this.styleRowBackground.bind(this);
  }

  insertLinks(key, value) {
    if (key === 'Cell' && value === 'html') {
      return row => <div dangerouslySetInnerHTML={{__html: row.value}} />;
    }
    else {
      return value;
    }
  }

  styleRowBackground(rowInfo) {
    if (rowInfo.index === this.state.selected) {
      return 'rgb(144,238,144,.6)';
    }
    else if (this.props.unknown && (rowInfo.row.Significance.startsWith('likely') || rowInfo.row.Significance.startsWith('known'))) {
      return 'rgb(255,250,205,.6)'
    }
    else if (rowInfo.row.Significance.startsWith('known')) {
      return 'rgb(255,250,205,.6)'
    }
    else {
      return 'inherit';
    }
  }

  getTrProps(state, rowInfo) {
    if (rowInfo) {
      return {
        onClick: () => {
          this.setState({
            selected: rowInfo.index === this.state.selected ? null : rowInfo.index
          })
        },
        style: {
          background: this.styleRowBackground(rowInfo)
        }
      };
    }
    return {};
  }

  onSortedChange(newSorted) {
    this.props.setProps({
      sorted: JSON.stringify(newSorted)
    });
  }

  render() {
    const data = JSON.parse(this.props.data)
    const columns = JSON.parse(this.props.columns, this.insertLinks);
    const tableProps = { getTrProps: this.getTrProps };

    return (
      <div>
        <ReactTable
          filterable
          {...tableProps}
          onSortedChange={this.onSortedChange}
          data={data}
          columns={columns}
          pageSize={data.length}
          showPagination={false}
          className="-striped -highlight"
        />
      </div>
    );
  }

}

DashReactTable.propTypes = {
  id: PropTypes.string,
  data: PropTypes.string,
  columns: PropTypes.string,
  sorted: PropTypes.string,
  unknown: PropTypes.bool
};

export default DashReactTable;
