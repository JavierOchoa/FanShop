import { FC, PropsWithChildren, useEffect, useState } from "react";
import {
  alpha,
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { ConfirmDeleteDialog, EnhancedTableHead } from "..";
import { ModalType, ProductAdminReponse, TableHeadCell, User } from "../../../interfaces";
import { UsersTableRows } from "./UserTable/UsersTableRows";
import { ProductTableRows } from "./ProductTable/ProductTableRows";

interface Props {
  tableTitle: string;
  elements: undefined | ProductAdminReponse[] | User[];
  handleOpenEditDialog: (dialogType: ModalType, elementId?: string) => void;
  headCells: TableHeadCell[];
  initialRowsPerPage: number;
  tableType: "product" | "user";
}

export const TableComponent: FC<PropsWithChildren<Props>> = ({
  tableTitle,
  elements,
  handleOpenEditDialog,
  headCells,
  initialRowsPerPage,
  tableType,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);

  useEffect(() => {
    setSelected([]);
  }, [elements]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = elements!.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - elements!.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
              {tableTitle}
            </Typography>
          )}
          {selected.length > 0 ? (
            <Stack direction={"row"}>
              <ConfirmDeleteDialog
                variant={"tooltip"}
                elements={selected}
                elementType={tableType}
                action={"delete"}
              />
              {tableType === "user" && (
                <Stack direction={"row"}>
                  <ConfirmDeleteDialog
                    variant={"tooltip"}
                    elements={selected}
                    elementType={tableType}
                    action={"deactivate"}
                  />
                  <ConfirmDeleteDialog
                    variant={"tooltip"}
                    elements={selected}
                    elementType={tableType}
                    action={"activate"}
                  />
                </Stack>
              )}
            </Stack>
          ) : (
            <Box>
              <Tooltip title={`New ${tableType}`} color={"primary"}>
                <IconButton onClick={() => handleOpenEditDialog("new")}>
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"small"}>
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={!elements ? 0 : elements.length}
              headCells={headCells}
            />
            <TableBody>
              {elements
                ? elements
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((element, index) => {
                      const isItemSelected = isSelected(element.id);
                      // const labelId = `enhanced-table-checkbox-${index}`;

                      if (tableType === "user") {
                        return (
                          <UsersTableRows
                            key={index}
                            isItemSelected={isItemSelected}
                            user={element as User}
                            handleClick={handleClick}
                            handleOpenEditDialog={handleOpenEditDialog}
                          />
                        );
                      }
                      if (tableType === "product") {
                        return (
                          <ProductTableRows
                            key={index}
                            isItemSelected={isItemSelected}
                            product={element as ProductAdminReponse}
                            handleClick={handleClick}
                            handleOpenEditDialog={handleOpenEditDialog}
                          />
                        );
                      }
                    })
                : Array(rowsPerPage)
                    .fill(<Skeleton animation="wave" width={500} />)
                    .map((skeleton, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{skeleton}</TableCell>
                        </TableRow>
                      );
                    })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {elements ? (
          <TablePagination
            rowsPerPageOptions={[15, 25, 35]}
            component="div"
            count={elements.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : (
          <></>
        )}
      </Paper>
    </Box>
  );
};
