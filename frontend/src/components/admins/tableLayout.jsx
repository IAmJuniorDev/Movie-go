import {
  Box,
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
  useTheme,
} from "@mui/material";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
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

const TableLayout = ({
  headers,
  data,
  onEdit,
  onDelete,
  onImageEdit = null,
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(
    headers && headers.length > 0 ? headers[0].toLowerCase() : ""
  );
  const [page, setPage] = useState(0);
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
            return (
              <TableRow key={rowIndex}>
                <TableCell align="center">
                  <Box component="span" sx={{display:"flex"}}>
                    {onEdit && (
                      <Box
                        component="a"
                        onClick={() => onEdit(row)}
                        sx={(theme) => ({
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          display: "flex",
                          color: theme.palette.grey[500],
                          textDecoration: "none",
                          margin: "0 5px 0 0",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      >
                        <ModeEditOutlinedIcon
                          sx={{
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.grey[500]
                                : theme.palette.primary.light,
                          }}
                        />
                      </Box>
                    )}
                    {onImageEdit && (
                      <Box
                        component="a"
                        onClick={() => onImageEdit(row.id)}
                        sx={(theme) => ({
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          display: "flex",
                          color: theme.palette.grey[500],
                          textDecoration: "none",
                          margin: "0 5px 0 0",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      >
                        <ImageOutlinedIcon
                          sx={(theme) => ({
                            color: theme.palette.warning.main,
                          })}
                        />
                      </Box>
                    )}
                    {onDelete && (
                      <Box
                        component="a"
                        onClick={() => onDelete(row.id)}
                        sx={(theme) => ({
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          display: "flex",
                          color: theme.palette.grey[500],
                          textDecoration: "none",
                          margin: "0 5px 0 0",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        })}
                      >
                        <DeleteForeverOutlinedIcon
                          sx={(theme) => ({
                            color: theme.palette.error.light,
                          })}
                        />
                      </Box>
                    )}
                  </Box>
                </TableCell>
                {headers.map((header, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    {row[header.toLowerCase()] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
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
