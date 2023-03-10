import { Box } from "@mui/material";
import { useState } from "react";
import { ProductDialog, TableComponent } from "../../components/admin";
import { ModalType, TableHeadCell } from "../../interfaces";
import { AdminLayout } from "../../layouts";
import { useGetProductsQuery } from "../../redux/services";
import { changeDialogType, changeOpenEditDialogStatus } from "../../redux/slices";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { data: productList } = useGetProductsQuery();
  const openEditDialog = useAppSelector((state) => state.admin.openEditDialog);
  const modalType = useAppSelector((state) => state.admin.dialogType);
  const [detailedProduct, setDetailedProduct] = useState<string | undefined>(undefined);

  const headCells: TableHeadCell[] = [
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

  const handleOpenEditDialog = async (dialogType: ModalType, productId?: string) => {
    if (productId) {
      setDetailedProduct(productId);
    }
    dispatch(changeDialogType(dialogType));
    dispatch(changeOpenEditDialogStatus());
  };
  return (
    <AdminLayout title={"Products"} pageDescription={"Product list in Admin Panel"}>
      {productList ? (
        productList.successful ? (
          <Box>
            <TableComponent
              tableTitle={"Product List"}
              elements={productList.data}
              handleOpenEditDialog={handleOpenEditDialog}
              headCells={headCells}
              initialRowsPerPage={15}
              tableType={"product"}
            />
            <ProductDialog
              productId={detailedProduct}
              openStatus={openEditDialog}
              dialogType={modalType}
            />
          </Box>
        ) : (
          <Box>Error</Box>
        )
      ) : (
        <Box>No Products</Box>
      )}
    </AdminLayout>
  );
}
