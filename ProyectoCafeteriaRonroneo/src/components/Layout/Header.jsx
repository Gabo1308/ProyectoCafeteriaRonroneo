// eslint-disable-next-line no-unused-vars
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import CoffeeIcon from "@mui/icons-material/Coffee";
import Tooltip from "@mui/material/Tooltip";

export default function Header() {
  const [anchorElUser, setAnchorEl] = React.useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  const [anchorElPrincipal, setAnchorElPrincipal] = React.useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };
  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };
  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const userItems = [
    { name: "Iniciar Sesión", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Cerrar Sesión", link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: "Productos", link: "/catalog-productos/" },
    { name: "Combos", link: "/catalog-combos/" },
    { name: "Menú", link: "/catalog-menu/" },
    { name: "Menú disponible", link: "/menu-disponible/" },
    { name: "Preparación", link: "/catalog-preparacion/" },
  ];

  const menuIdPrincipal = "menu-appbar";

  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems &&
        navItems.map((item, index) => {
          return (
            <Button key={index} component={Link} to={item.link} color="secondary">
              <Typography textAlign="center">{item.name}</Typography>
            </Button>
          );
        })}
    </Box>
  );

  const menuPrincipalMobile = navItems.map((page, index) => (
    <MenuItem key={index} component={Link} to={page.link}>
      <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
    </MenuItem>
  ));

  const userMenuId = "user-menu";

  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        <MenuItem>
          <Typography variant="subtitle1" gutterBottom>
            Email usuario
          </Typography>
        </MenuItem>
        {userItems.map((setting, index) => {
          return (
            <MenuItem key={index} component={Link} to={setting.link}>
              <Typography sx={{ textAlign: "center" }}>
                {setting.name}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );

  const menuOpcionesId = "badge-menu-mobile";

  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Carrito</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-controls={menuIdPrincipal}
            aria-haspopup="true"
            sx={{ mr: 2 }}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>
          <Tooltip title="Cafetería Ronroneo">
            <IconButton
              size="large"
              edge="end"
              component="a"
              href="/"
              aria-label="Cafetería Ronroneo"
              color="primary"
            >
              <CoffeeIcon />
            </IconButton>
          </Tooltip>
          {menuPrincipal}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
