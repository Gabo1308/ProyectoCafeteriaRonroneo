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
import Logo from "../../assets/Logo_cafeteria.jpeg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "react-i18next";
import { SelectorIdioma } from "./SelectorIdioma";

export default function HeaderRonroneo() {
  const { t } = useTranslation();

  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);
  const [anchorElMantenimientos, setAnchorElMantenimientos] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null); 
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const navigate = useNavigate();

  const { getCantidadItems } = useCart();

  let usuario = null;
  const userStr = localStorage.getItem("user");
  try {
    if (userStr && userStr !== "undefined") {
      usuario = JSON.parse(userStr);
    } else if (userStr === "undefined") {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Error parsing user:", error);
    localStorage.removeItem("user");
  }

  /*const navItems = [
    { name: "Productos", link: "/catalog-productos/" },
    { name: "Combos", link: "/catalog-combos/" },
    { name: "Menús", link: "/catalog-menu/" },
    { name: "Preparación", link: "/catalog-preparacion/" },
    { name: "Mis pedidos", link: "/pedidos" },
  ];*/
  const navItems = [
  { name: t("header.products"), link: "/catalog-productos/" },
  { name: t("header.combos"), link: "/catalog-combos/" },
  { name: t("header.menus"), link: "/catalog-menu/" },
  { name: t("header.preparation"), link: "/catalog-preparacion/" },
  { name: t("header.myOrders"), link: "/pedidos" },
  ];

  /*const mantenimientosItems = [
    { name: "Productos", link: "/admin/productos/" },
    { name: "Combos", link: "/admin/combos/" },
    { name: "Menús", link: "/admin/menus/" },
    { name: "Preparación", link: "/admin/preparacion/" },
    { name: "Usuarios", link: "/admin/usuarios/" },
  ];*/
  const mantenimientosItems = [
  { name: t("header.products"), link: "/admin/productos/" },
  { name: t("header.combos"), link: "/admin/combos/" },
  { name: t("header.menus"), link: "/admin/menus/" },
  { name: t("header.preparation"), link: "/admin/preparacion/" },
  { name: t("header.users"), link: "/admin/usuarios/" },
  ];

  /*let userItems = [];

  if (usuario) {
    userItems = [{ name: "Cerrar Sesión", link: "/logout" }];
  } else {
    userItems = [
      { name: "Iniciar Sesión", link: "/login" },
      { name: "Registrarse", link: "/create" },
    ];
  }*/
  let userItems = [];

  if (usuario) {
    userItems = [
      {
        name: t("header.logout"),
        link: "/logout",
      },
    ];
  } else {
    userItems = [
      {
        name: t("header.login"),
        link: "/login",
      },
      {
        name: t("header.register"),
        link: "/create",
      },
    ];
  }

  const cerrarMenus = () => {
    setAnchorElPrincipal(null);
    setAnchorElMantenimientos(null);
    setAnchorElUser(null);
  };

  const abrirDialogoLogout = () => {
    cerrarMenus();
    setLogoutDialogOpen(true);
  };

  const cancelarLogout = () => {
    setLogoutDialogOpen(false);
  };

  const confirmarLogout = () => {
    localStorage.removeItem("user");
    setLogoutDialogOpen(false);
    window.location.href = "/";
  };

  return (
    <AppBar position="static" color="primaryLight" sx={{ backgroundColor: "primaryLight.main" }}>
      <Toolbar sx={{ gap: 1, minHeight: 68 }}>
        <IconButton
          size="large"
          color="primary"
          /*aria-label="abrir navegacion"*/
          aria-label={t("header.openNavigation")}
          onClick={(event) => setAnchorElPrincipal(event.currentTarget)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Tooltip title="Cafeteria Ronroneo">
          <IconButton component={Link} to="/" aria-label="Cafeteria Ronroneo" sx={{ p: 0.5 }}>
            <Box
              component="img"
              src={Logo}
              alt="Logo Cafeteria Ronroneo"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid",
                borderColor: "primary.main",
                backgroundColor: "common.white",
              }}
            />
          </IconButton>
        </Tooltip>

        <Typography
          variant="subtitle1"
          color="primary.dark"
          sx={{ fontWeight: 800, whiteSpace: "nowrap", mr: { xs: 0, md: 1 } }}
        >
          Ronroneo
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.link}
              component={Link}
              to={item.link}
              size="small"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                minWidth: "auto",
                fontWeight: 700,
                color: "primary.dark",
              }}
            >
              {item.name}
            </Button>
          ))}
          
          {(usuario?.Rol === "Encargado" || usuario?.Rol === "Administrador") && (
            <Button
              component={Link}
              to="/estacion"
              size="small"
              sx={{
               textTransform: "none",
               fontWeight: 700,
               color: "primary.dark",
              }}
            >

              {usuario.Rol === "Administrador" ? t("header.stations") : t("header.myStation")}
              </Button>
              )}

          {usuario?.Rol === "Administrador" && (
            <Button
              color="primary"
              size="small"
              startIcon={<SettingsIcon />}
              endIcon={<ExpandMoreIcon />}
              onClick={(event) => setAnchorElMantenimientos(event.currentTarget)}
              sx={{ textTransform: "none", whiteSpace: "nowrap", fontWeight: 700, color: "primary.dark" }}
            >
              {t("header.maintenance")}
            </Button>
          )}
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

          {(usuario?.Rol === "Encargado" || usuario?.Rol === "Administrador") && (
            <MenuItem component={Link} to="/estacion" onClick={cerrarMenus}>
              {usuario.Rol === "Administrador" ? t("header.stations") : t("header.myStation")}
            </MenuItem>
          )}

          {usuario?.Rol === "Administrador" && (
            <>
              <Divider />
              <MenuItem disabled>
                {/*<Typography variant="caption">Mantenimientos</Typography>*/}
                <Typography variant="caption"> {t("header.maintenance")} </Typography>
              </MenuItem>
              {mantenimientosItems.map((item) => (
                <MenuItem key={item.link} component={Link} to={item.link} onClick={cerrarMenus}>
                  {item.name}
                </MenuItem>
              ))}
            </>
          )}
        </Menu>

        <Box sx={{ flexGrow: 1 }} />

        <SelectorIdioma /> 

        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          {usuario && (
            /*<Tooltip title="Carrito">*/
            <Tooltip title={t("header.cart")}>
              <IconButton size="large" color="inherit" component={Link} to="/carrito">
                <Badge badgeContent={getCantidadItems()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          {/*<Tooltip title="Notificaciones">*/}
          <Tooltip title={t("header.notifications")}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
        <IconButton
          size="large"
          /*aria-label="cuenta de usuario"*/
          aria-label={t("header.userAccount")}
          onClick={(event) => setAnchorElUser(event.currentTarget)}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={() => setAnchorElUser(null)}>
          <MenuItem disabled>
            {/*<Typography variant="subtitle2">Usuario</Typography>*/}
            <Typography variant="subtitle2"> {t("header.user")} </Typography>
          </MenuItem>
          {userItems.map((item) =>
            item.link === "/logout" ? (
              <MenuItem key={item.link} onClick={abrirDialogoLogout}>
                {item.name}
              </MenuItem>
            ) : (
              <MenuItem key={item.link} component={Link} to={item.link} onClick={cerrarMenus}>
                {item.name}
              </MenuItem>
            )
          )}
        </Menu>
        {/*<Dialog open={logoutDialogOpen} onClose={cancelarLogout}>
          <DialogTitle>Cerrar sesión</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas cerrar sesión?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelarLogout} color="inherit">
              Cancelar
            </Button>
            <Button onClick={confirmarLogout} color="primary" variant="contained">
              Cerrar sesión
            </Button>
          </DialogActions>
        </Dialog>*/}
        <Dialog open={logoutDialogOpen} onClose={cancelarLogout}>
          <DialogTitle> {t("header.logout")} </DialogTitle>
          <DialogContent>
            <DialogContentText>   
              {t("header.logoutQuestion")} 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelarLogout} color="inherit">
              {t("header.cancel")}
            </Button>
            <Button onClick={confirmarLogout} color="primary" variant="contained" >
              {t("header.logout")}
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}



