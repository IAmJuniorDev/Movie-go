import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button
} from "@mui/material";

const TableLayout = ({headers,data,onAction}) => {

  return(
    <TableContainer component={Paper}>
      <Table aria-label="Table Layout">
        <TableHead>
          <TableRow>
            <TableCell align="center">Action</TableCell>
            {headers.map((e,index)=>{
              return(
                <TableCell key={index} align="center">
                  {e}
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell align="center">
                <Button onClick={() => onAction(row.id)}>Action</Button>
              </TableCell>
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex} align="center">
                  {row[header.toLowerCase()] || "-"} {/* Assuming the headers match the data keys */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default TableLayout;
