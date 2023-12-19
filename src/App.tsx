import { Fragment, useEffect, useMemo, useState } from "react";

import "./App.css";
import { UsersModel } from "./models/UsersModel";
import { PageParams } from "./models/PageParams";
import {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MaterialReactTable,
} from "material-react-table";
import axios from "axios";
import httpAgent from "./api/httpAgent";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

function App() {
  //An array of UsersModel objects representing the data to be displayed in a table.
  const [tableData, setTableData] = useState<UsersModel[]>([]);

  //Represents parameters related to user data pagination and filtering.
  //It includes properties like orderBy, pageNumber, pageSize, searchTerm, and columnFilters.
  //This state likely controls the parameters used for fetching user data.
  const [userParams, setParams] = useState<PageParams>({
    orderBy: "",
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
    columnFilters: "",
  });
  //A boolean flag indicating whether an error occurred during data fetching or processing.
  const [isError, setIsError] = useState(false);
  //A boolean flag to indicate whether data is currently being fetched or processed.
  const [isLoading, setIsLoading] = useState(false);
  //A boolean flag possibly used to indicate when a re-fetch of data is occurring.
  const [isRefetching, setIsRefetching] = useState(false);
  //Represents the total count of rows or items.
  const [rowCount, setRowCount] = useState(0);
  //State holding column filters for the data table.
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  //A state used for a global filter, possibly filtering data across multiple columns or properties.
  const [globalFilter, setGlobalFilter] = useState("");
  //State holding sorting information for the table data.
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  //Represents pagination state with properties
  //like pageIndex and pageSize, used to manage the current page index and size for data pagination.
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //With this function, we can construct URL parameters based on the state values for pagination, filtering, sorting, and global search.
  function getAxiosParams(pageParams: PageParams) {
    const params = new URLSearchParams();
    params.append("pageNumber", (pagination.pageIndex + 1).toString());
    params.append("pageSize", pagination.pageSize.toString());

    if (globalFilter) params.append("searchTerm", globalFilter);
    if (columnFilters.length > 0)
      params.append("columnFilters", JSON.stringify(columnFilters ?? []));
    if (sorting.length > 0)
      params.append("orderBy", JSON.stringify(sorting ?? []));

    return params;
  }

  useEffect(() => {
    if (columnFilters.length > 0) {
      setPagination((prevstate) => {
        return {
          ...prevstate,
          pageIndex: 0,
        };
      });
    }
    getData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    globalFilter,
    columnFilters,
    sorting,
  ]);

  let source: any;
  const getData = async () => {
    if (!tableData.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    if (source) {
      source.cancel();
    }
    //Creating cancellation token
    source = axios.CancelToken.source();
    //Setting Axios parameters
    const params = getAxiosParams(userParams);
    //Fetching data from API.
    await httpAgent.Users.getUsersList(params, source.token)
      .then((data) => {
        //Sets the fetched data to the state variables
        setTableData(data.items);
        setRowCount(data.metaData.totalCount);

        //Handles loading and refetching states based on the presence of existing data or ongoing requests.
        setIsLoading(false);
        setIsRefetching(false);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          setIsRefetching(false);
        }
      });
  };

  const columns = useMemo<MRT_ColumnDef<UsersModel>[]>(
    () => [
      {
        header: "User Id",
        accessorKey: "user_id",
      },
      {
        header: "User Name",
        accessorKey: "user_name",
      },
      {
        header: "User Age",
        accessorKey: "user_age",
      },
    ],

    []
  );

  return (
    <Fragment>
      <Paper>
        <Box>
          <MaterialReactTable
            columns={columns}
            data={tableData}
            //enableRowSelection
            //getRowId={(row) => row.customerName}
            initialState={{ showColumnFilters: false }}
            manualFiltering
            manualPagination
            manualSorting
            muiToolbarAlertBannerProps={
              isError
                ? {
                    color: "error",
                    children: "Error loading data",
                  }
                : undefined
            }
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            rowCount={rowCount}
            state={{
              columnFilters,
              globalFilter,
              isLoading,
              pagination,
              showAlertBanner: isError,
              showProgressBars: isRefetching,
              sorting,
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: { borderRadius: "0", border: "1px solid #8d8c8c5e" },
            }}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGrouping
            enableStickyHeader
            enableRowActions
            enableSorting={false}
            displayColumnDefOptions={{
              "mrt-row-actions": {
                header: "", //change header text
              },
            }}
          />
        </Box>
      </Paper>
    </Fragment>
  );
}

export default App;
