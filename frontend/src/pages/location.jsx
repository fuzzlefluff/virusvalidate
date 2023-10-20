import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config.json'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'


{/*This creates a page to input and manage location information*/ }


{/* This section comes from the example of TanStack Table */ }

// Give our default column cell renderer editing superpowers!
const defaultColumn = {
  cell: function ({ getValue, row, column, table }) {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta && table.options.meta.updateData(row.index, column.id, value);
    };

    // If the initialValue is changed externally, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

//A function that is used to skip re-rendering our table when paging
function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip];
}
{/* End of TanTable support functions*/ }


const App = () => {

  //Create a place to store our table data from the api
  const [data, setData] = useState([]);
  //Create a place to store the page loading state
  const [loading, setLoading] = useState(true);
  //Create a place to store our error state and message
  const [error, setError] = useState(null);
  //Create a place to store whether we should skip re-rendering our table depending on paging
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  //Define the columns we are going to use in our TanStack Table (React Table)
  const columns = React.useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        footer: (props) => props.column.id,
      },
      {
        header: 'Address',
        accessorKey: 'address',
        footer: (props) => props.column.id,
      },
      {
        header: 'Delete',
        accessorKey: '_id',
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  //Get our data from the API
  async function fetchData(url) {
    try {
      const response = await axios.get(url);
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  //Call our fetch data function with the correct API url
  useEffect(() => {
    fetchData(config.API_URL + '/locations');
  }, []);

  //Create our Table Object
  const table = useReactTable({
    data: data,
    columns: columns,
    defaultColumn: defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after the next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: false,
  });

  //Define how our search headers will filter the table
  function Filter({ column, table, uniqueKey }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    // Local state to manage the input values
    const [minValue, setMinValue] = useState(Array.isArray(columnFilterValue) ? columnFilterValue[0] : '');
    const [maxValue, setMaxValue] = useState(Array.isArray(columnFilterValue) ? columnFilterValue[1] : '');

    const handleMinChange = (e) => {
      setMinValue(e.target.value);
      column.setFilterValue((old) => [
        e.target.value,
        Array.isArray(old) ? old[1] : '',
      ]);
    };

    const handleMaxChange = (e) => {
      setMaxValue(e.target.value);
      column.setFilterValue((old) => [
        Array.isArray(old) ? old[0] : '',
        e.target.value,
      ]);
    };

    return typeof firstValue === 'number' ? (
      <div className="">
        <input
          type="number"
          value={minValue}
          onChange={handleMinChange}
          placeholder={`Min`}

        />
        <input
          type="number"
          value={maxValue}
          onChange={handleMaxChange}
          placeholder={`Max`}

        />
      </div>
    ) : (
      <input
        type="text"
        key="searchheader"
        value={columnFilterValue || ''}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}

      />
    );
  }

  //A function called by our delete buttons to delete the table entry from the database
  async function deleteEntry(id) {
    var r = confirm("are you sure you want to delete the location?")
    if (r == true) {
      const response = await axios.delete(config.API_URL + '/location/' + id)
      window.location.reload(false)
    }
  }

  //A function that will submit table data edits to the API database
  const handleCellChange = (value) => {
    // Implement your cell value change logic here
  };

  //A function that submits new data to the API database
  async function handleSubmit(event) {
    event.preventDefault()
    const location = { name: event.target.locname.value, address: event.target.locaddress.value }
    const response = await axios.post(config.API_URL + '/location', location);
    window.location.reload(false)
  }

  //We define our HTML page here
  return (
    <div className="app-container">
      <h2>Locations</h2>
      {/* Define a spot to render that we are still fetching data from the API, or the error that occured during said process*/}
      <div className="apiinfo">
        {loading && <div>Getting data from backend...</div>}
        {error && (
          <div id="error">
            There is a problem getting data from the API: - {error}
          </div>
        )}
      </div>
      <div>
        {/* Define our table if the table data is not null*/}
        {table ? (
          <div className="p-2">
            <div className="h-2" />
            <table>
              <thead>
                {/* For each header group in the table object, we render a table header*/}
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* If searching (filtering) is possible then we render the proper search box type from our filter function*/}
                            {header.column.getCanFilter() ? (
                              <div>
                                <Filter
                                  column={header.column}
                                  table={table}
                                  key={header.id} // Use a unique key
                                />
                              </div>
                            ) : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {/* For each data item in the table object, we render a table row with the correct information*/}
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
                }
              </tbody>
            </table>

            {/* Define our table page controls*/}
            <div className="h-2" />
            <div className="flex items-center gap-2">
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div>{table.getRowModel().rows.length} Rows</div>

          </div>
        ) : null}
      </div>

      {/* Define a form to submit new data to the API databsae*/}
      <h2>Add a Location</h2>
      <div className="vvcontainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="locname"
            required="required"
            placeholder="Location Name"
          />
          <input
            type="text"
            name="locaddress"
            required="required"
            placeholder="Location Address"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};


export default App;