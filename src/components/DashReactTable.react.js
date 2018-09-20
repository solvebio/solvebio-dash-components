import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';

import naturalSort from 'javascript-natural-sort';

import 'react-table/react-table.css';

class DashReactTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      width: 0,
      height: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getTrProps = this.getTrProps.bind(this);
    this.onSortedChange = this.onSortedChange.bind(this);
    this.styleRowBackground = this.styleRowBackground.bind(this);
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

  processColumns(key, value) {
    if (key === 'Cell' && value === 'html') {
      return row => <span dangerouslySetInnerHTML={{ __html: row.original[row.column.htmlAccessor] }} />;
    }
    else if (key === 'Cell' && value === 'percent') {
      return row => <span className='column__percent'>{row.value}</span>;
    }
    else if (key === 'sortMethod' && value === 'natural') {
      return naturalSort;
    }
    else {
      return value;
    }
  }

  styleRowBackground(rowInfo) {
    if (rowInfo.index === this.state.selected) {
      return 'rgb(144,238,144,.6)';
    }
    else if (this.props.unknown && rowInfo.row.Significance && (rowInfo.row.Significance.startsWith('likely') || rowInfo.row.Significance.startsWith('known'))) {
      return 'rgb(255,250,205,.6)';
    }
    else if (rowInfo.row.Significance && rowInfo.row.Significance.startsWith('known')) {
      return 'rgb(255,250,205,.6)';
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
          });
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

  defaultFilterMethod(filter, row) {
    if (row[filter.id] !== null) {
      return String(row[filter.id].toLowerCase()).includes(filter.value.toLowerCase());
    }
  }

  render() {
    const data = JSON.parse(this.props.data);
    const columns = JSON.parse(this.props.columns, this.processColumns);
    columns.forEach(column => {
      if (!('Cell' in column)) {
        column.Cell = row => <span>{row.value}</span>;
      }
    });
    const tableProps = { getTrProps: this.getTrProps };
    const numRows = Math.floor(this.state.height * 0.4 / 30);
    const sortBy = JSON.parse(this.props.sortBy);

    return (
      <div>
        <ReactTable
          filterable
          {...tableProps}
          onSortedChange={this.onSortedChange}
          data={data}
          columns={columns}
          pageSize={Math.min(data.length, numRows)}
          showPageSizeOptions={false}
          showPagination={data.length > numRows}
          defaultFilterMethod={this.defaultFilterMethod}
          defaultSorted={sortBy}
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
  sortBy: PropTypes.string,
  unknown: PropTypes.bool
};

export default DashReactTable;
