import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { useState } from "react";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const TableLayout = ({ headers, data, onAction }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(
    headers && headers.length > 0 ? headers[0].toLowerCase() : ""
  );  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sortedData = [...data].sort(getComparator(order, orderBy));
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Table Layout">
        <TableHead>
          <TableRow>
            <TableCell align="center">Action</TableCell>
            {headers.map((header, index) => {
              const property = header.toLowerCase();
              return (
                <TableCell
                  key={index}
                  align="center"
                  sortDirection={orderBy === property ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === property}
                    direction={orderBy === property ? order : "asc"}
                    onClick={() => handleRequestSort(property)}
                  >
                    {header}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, rowIndex) => {
            return(
            <TableRow key={rowIndex}>
              <TableCell align="center">
                <Button onClick={() => onAction(row.id)}>Action</Button>
                <Button onClick={() => console.log(row[0])}>Action</Button>
              </TableCell>
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex} align="center">
                  {row[header.toLowerCase()] || "-"}
                </TableCell>
              ))}
            </TableRow>
          )})}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]} // hides the dropdown
      />
    </TableContainer>
  );
};

export default TableLayout;
