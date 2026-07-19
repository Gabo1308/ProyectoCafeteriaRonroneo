import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useCart } from "../../hooks/useCart";

CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
  updateCantidad: PropTypes.func,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function CartItem({ item, removeItem, updateCantidad }) {
  const subtotal = (item.Precio * item.Cantidad).toFixed(2);

  return (
    <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <StyledTableCell component="th" scope="row">
        {item.Nombre}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {item.Tipo === "producto" ? "Producto" : "Combo"}
        </Typography>
      </StyledTableCell>
      <StyledTableCell>&cent;{item.Precio.toFixed(2)}</StyledTableCell>
      <StyledTableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad - 1)}
            disabled={item.Cantidad <= 1}
            aria-label={"Restar " + item.Nombre}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ minWidth: 24, textAlign: "center" }}>{item.Cantidad}</Typography>
          <IconButton
            size="small"
            onClick={() => updateCantidad(item, item.Cantidad + 1)}
            aria-label={"Sumar " + item.Nombre}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </StyledTableCell>
      <StyledTableCell>&cent;{subtotal}</StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title={"Quitar " + item.Nombre}>
          <IconButton
            color="warning"
            onClick={() => removeItem(item)}
            aria-label={"Quitar " + item.Nombre}
            sx={{ ml: "auto" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export function Cart() {
  const { cart, removeItem, cleanCart, getTotal, updateCantidad } = useCart();

  if (cart.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <RemoveShoppingCartIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Tu carrito está vacío
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" color="primary.main">
          Mi carrito
        </Typography>
        <Tooltip title="Vaciar carrito">
          <IconButton color="error" onClick={() => cleanCart()} aria-label="Vaciar carrito">
            <RemoveShoppingCartIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 500 }} aria-label="Carrito de compras">
          <TableHead>
            <TableRow>
              <StyledTableCell>Ítem</StyledTableCell>
              <StyledTableCell>Precio</StyledTableCell>
              <StyledTableCell>Cantidad</StyledTableCell>
              <StyledTableCell>Subtotal</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <CartItem
                key={`${item.Tipo}-${item.Id}`}
                item={item}
                removeItem={removeItem}
                updateCantidad={updateCantidad}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan={3} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Total
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1" gutterBottom>
                  &cent;{getTotal(cart)}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}