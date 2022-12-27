import React, { useEffect } from "react";
import {
  alpha,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdminLayout } from "../../layouts";
import { ProductAdminReponse, DetailedProduct } from "../../interfaces";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useGetProductsMutation, useGetProductDetailsMutation } from "./../../redux/services";
import { EditProductDialog } from "../../components/admin";
import { useAppSelector, useAppDispatch } from "../../utils/hooks";
import { changeOpenEditDialogStatus } from "./../../redux/slices/productSlice";
import useAdmin from "../../utils/hooks/useAdmin";

interface HeadCell {
  disablePadding: boolean;
  id: keyof ProductAdminReponse;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

const headCells: readonly HeadCell[] = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Product title",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "stock",
    numeric: true,
    disablePadding: false,
    label: "Stock",
  },
  {
    id: "user",
    numeric: false,
    disablePadding: false,
    label: "Created by",
  },
];

interface EnhancedTableToolbarProps {
  tableToolbarTitle: string;
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { tableToolbarTitle, numSelected } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
          {tableToolbarTitle}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {/* TODO: New Product */}
    </Toolbar>
  );
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all products",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={index > 0 ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function AdminPanel() {
  const dispatch = useAppDispatch();
  const { loadingProducts, productList, getDetailedProduct } = useAdmin();
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(15);
  const openEditDialog = useAppSelector((state) => state.products.openEditDialog);
  const [productToEdit, setProductToEdit] = React.useState<DetailedProduct | undefined>(undefined);

  const handleOpenEditDialog = async (productId: string) => {
    const detailedProduct = await getDetailedProduct(productId);
    setProductToEdit(detailedProduct);
    dispatch(changeOpenEditDialogStatus());
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = productList!.map((n) => n.title);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty productList.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList!.length) : 0;

  return (
    <AdminLayout title="Admin Panel" pageDescription="Admin panel for FanShop">
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar tableToolbarTitle={"Product List"} numSelected={selected.length} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"small"}>
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={!productList ? 0 : productList.length}
              />
              <TableBody>
                {productList
                  ? productList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product, index) => {
                        const isItemSelected = isSelected(product.title);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            // onClick={handleOpenEditDialog}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={product.title}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, product.title)}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="product"
                              padding="none"
                              onClick={async () => await handleOpenEditDialog(product.id)}
                            >
                              {product.title}
                            </TableCell>
                            <TableCell align="right">{product.price}</TableCell>
                            <TableCell align="right">{product.stock}</TableCell>
                            <TableCell align="right">{product.user.fullName}</TableCell>
                          </TableRow>
                        );
                      })
                  : Array(rowsPerPage)
                      .fill(<Skeleton animation="wave" width={50} />)
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
          {productList ? (
            <TablePagination
              rowsPerPageOptions={[15, 25, 35]}
              component="div"
              count={productList.length}
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
      <EditProductDialog openStatus={openEditDialog} product={productToEdit} />
    </AdminLayout>
  );
}
