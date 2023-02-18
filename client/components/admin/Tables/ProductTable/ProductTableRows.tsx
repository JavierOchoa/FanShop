import { FC, PropsWithChildren } from "react";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import { ModalType, ProductAdminReponse } from "../../../../interfaces";

interface Props {
  isItemSelected: boolean;
  product: ProductAdminReponse;
  handleClick: (id: string) => void;
  handleOpenEditDialog: (type: ModalType, id: string) => void;
}

export const ProductTableRows: FC<PropsWithChildren<Props>> = ({
  isItemSelected,
  product,
  handleClick,
  handleOpenEditDialog,
}) => {
  return (
    <TableRow
      hover
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
          onChange={() => handleClick(product.id)}
          inputProps={{
            "aria-labelledby": `enhanced-table-checkbox-${product.id}`,
          }}
        />
      </TableCell>
      <TableCell
        component="th"
        id={`enhanced-table-checkbox-${product.id}`}
        scope="product"
        padding="none"
        onClick={async () => await handleOpenEditDialog("edit", product.id)}
      >
        {product.title}
      </TableCell>
      <TableCell align="right">{product.price}</TableCell>
      <TableCell align="right">{product.stock}</TableCell>
      <TableCell align="right">{product.user.fullName}</TableCell>
    </TableRow>
  );
};
