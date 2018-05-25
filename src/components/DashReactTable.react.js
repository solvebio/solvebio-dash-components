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
  }

  insertLinks(key, value) {
    return (key === 'Cell' && value === 'url')
      ? row => <a href={row.column.url + row.value} target='_blank'>{row.column.label}</a>
      : value
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
          background: rowInfo.index === this.state.selected ? 'rgb(144,238,144,.6)' : 'inherit'
        }
      };
    }
    return {};
  }

  onSortedChange(newSorted, column, shiftKey) {
    console.log(newSorted);
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
          // filterable
          // {...tableProps}
          onSortedChange={this.onSortedChange}
          data={data}
          columns={columns}
          defaultPageSize={10}
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
  sorted: PropTypes.string
};

export default DashReactTable;
