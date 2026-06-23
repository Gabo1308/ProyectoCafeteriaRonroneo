import React from "react";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CoffeeIcon from "@mui/icons-material/Coffee";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

export default function HeaderRonroneo() {
  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);
  const [anchorElMantenimientos, setAnchorElMantenimientos] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navItems = [
    { name: "Productos", link: "/catalog-productos/" },
    { name: "Combos", link: "/catalog-combos/" },
    { name: "Menus", link: "/catalog-menu/" },
    { name: "Disponible", link: "/menu-disponible/" },
    { name: "Preparacion", link: "/catalog-preparacion/" },
  ];

  const mantenimientosItems = [
    { name: "Productos", link: "/admin/productos/" },
    { name: "Combos", link: "/admin/combos/" },
    { name: "Menus", link: "/admin/menus/" },
  ];

  const userItems = [
    { name: "Iniciar Sesion", link: "/user/login" },
    { name: "Registrarse", link: "/user/create" },
    { name: "Cerrar Sesion", link: "/user/logout" },
  ];

  const cerrarMenus = () => {
    setAnchorElPrincipal(null);
    setAnchorElMantenimientos(null);
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="primaryLight" sx={{ backgroundColor: "primaryLight.main" }}>
      <Toolbar sx={{ gap: 1, minHeight: 68 }}>
        <IconButton
          size="large"
          color="primary"
          aria-label="abrir navegacion"
          onClick={(event) => setAnchorElPrincipal(event.currentTarget)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Tooltip title="Cafeteria Ronroneo">
          <IconButton component={Link} to="/" color="primary" aria-label="Cafeteria Ronroneo">
            <CoffeeIcon />
          </IconButton>
        </Tooltip>

        <Typography
          variant="subtitle1"
          color="primary.main"
          sx={{ fontWeight: 700, whiteSpace: "nowrap", mr: { xs: 0, md: 1 } }}
        >
          Ronroneo
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.link}
              component={Link}
              to={item.link}
              color="primary"
              size="small"
              sx={{ textTransform: "none", whiteSpace: "nowrap", minWidth: "auto" }}
            >
              {item.name}
            </Button>
          ))}

          <Button
            color="primary"
            size="small"
            startIcon={<SettingsIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={(event) => setAnchorElMantenimientos(event.currentTarget)}
            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
          >
            Mantenimientos
          </Button>
        </Box>

        <Menu
          anchorEl={anchorElMantenimientos}
          open={Boolean(anchorElMantenimientos)}
          onClose={() => setAnchorElMantenimientos(null)}
        >
          {mantenimientosItems.map((item) => (
            <MenuItem key={item.link} component={Link} to={item.link} onClick={cerrarMenus}>
              {item.name}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={anchorElPrincipal}
          open={Boolean(anchorElPrincipal)}
          onClose={() => setAnchorElPrincipal(null)}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {navItems.map((item) => (
            <MenuItem key={item.link} component={Link} to={item.link} onClick={cerrarMenus}>
              {item.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem disabled>
            <Typography variant="caption">Mantenimientos</Typography>
          </MenuItem>
          {mantenimientosItems.map((item) => (
            <MenuItem key={item.link} component={Link} to={item.link} onClick={cerrarMenus}>
              {item.name}
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <Tooltip title="Carrito">
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Notificaciones">
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <IconButton
          size="large"
          aria-label="cuenta de usuario"
          onClick={(event) => setAnchorElUser(event.currentTarget)}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={() => setAnchorElUser(null)}>
          <MenuItem disabled>
            <Typography variant="subtitle2">Usuario</Typography>
          </MenuItem>
          {userItems.map((item) => (
            <MenuItem key={item.link} component={Link} to={item.link} onClick={cerrarMenus}>
              {item.name}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
