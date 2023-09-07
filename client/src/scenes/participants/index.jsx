import React, {useState} from "react";
import { Box, useTheme, Tooltip } from "@mui/material";
import { useGetParticipantsQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbarParticipants from "components/DataGridCustomToolbarParticipants";


import {
    Person,
    AdminPanelSettings,
    SupervisorAccountRounded
} from "@mui/icons-material";

const Participants = () => {
    const theme = useTheme();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sort, setSort] = useState({});
   
    const [search, setSearch] = useState("");

    const [searchInput, setSearchInput] = useState("");
    const { data, isLoading} = useGetParticipantsQuery({
        page,
        pageSize,
        sort: JSON.stringify(sort),
        search
    });

   
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      renderCell: (params) => {
        let roleName = "";
        let roleIcon = null;

        if (params.value === "user") {
          roleName = "User";
          roleIcon = <Person />;
        } else if (params.value === "admin") {
          roleName = "Admin";
          roleIcon = <AdminPanelSettings />;
        } else {
          roleName = "Supervisor";
          roleIcon = <SupervisorAccountRounded />;
        }

        return (
          <Tooltip title={roleName}>
            {roleIcon}
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PARTICIPANTS" subtitle="List of Partcipants" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={data?.participants || []}
          columns={columns}
          pagination
          page={page}
          pageSize={pageSize}
          rowCount={data?.total || 0}
          rowsPerPageOptions={[20, 50, 100]}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          paginationMode="server"
          sortingMode="server"
          components={{ Toolbar: DataGridCustomToolbarParticipants }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
       
      </Box>
    </Box>
  );
};

export default Participants;
