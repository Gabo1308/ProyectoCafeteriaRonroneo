import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ProductoService from "../../services/ProductosServices";
import CategoriaService from "../../services/CategoriaServices";
import IngredienteService from "../../services/IngredienteServices";

const productoVacio = {
  IdProducto: null,
  IdCategoria: "",
  Nombre: "",
  Descripcion: "",
  ingredientes: [],
  Imagen: "",
  Precio: "",
  Estado: 1,
};

export function GestionProductos() {
  const { t } = useTranslation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catalogoIngredientes, setCatalogoIngredientes] = useState([]);
  const [form, setForm] = useState(productoVacio);
  const [loaded, setLoaded] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [productosEliminados, setProductosEliminados] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  const cargarDatos = () => {
    Promise.all([
      ProductoService.getProductos(),
      ProductoService.getProductosDesactivados(),
      CategoriaService.getCategorias(),
      IngredienteService.getIngredientes(),
    ])
      .then(
        ([
          productosResponse,
          desactivadosResponse,
          categoriasResponse,
          ingredientesResponse,
        ]) => {
          setProductos(productosResponse.data || []);
          setProductosEliminados(desactivadosResponse.data || []);
          setCategorias(categoriasResponse.data || []);
          setCatalogoIngredientes(
            [...(ingredientesResponse.data || [])].sort((a, b) =>
              a.Nombre.localeCompare(b.Nombre, "es"),
            ),
          );
          setLoaded(true);
        },
      )
      .catch((err) => {
        setLoaded(true);
        toast.error(t("admin.loadError", { message: err.message }));
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const actualizarCampo = (event) => {
    const { name, value } = event.target;
    setForm((actual) => ({ ...actual, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm(productoVacio);
  };

  const subirImagen = (event) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    setSubiendoImagen(true);
    ProductoService.uploadImagenProducto(archivo)
      .then(async (response) => {
        setForm((actual) => ({ ...actual, Imagen: response.data.fileName }));
        toast.success(t("adminProducts.imageUploaded"));
      })
      .catch((err) => toast.error(t("admin.uploadError", { message: err.message })))
      .finally(() => {
        setSubiendoImagen(false);
        event.target.value = "";
      });
  };

  const editarProducto = (producto) => {
    setForm({
      IdProducto: producto.IdProducto,
      IdCategoria: producto.IdCategoria,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion || "",
      ingredientes: (producto.Ingredientes || []).map((ingrediente) =>
        Number(ingrediente.IdIngrediente),
      ),
      Imagen: producto.Imagen || "",
      Precio: producto.Precio,
      Estado: producto.Estado ?? 1,
    });
  };

  const ingredientesSeleccionados = catalogoIngredientes.filter((ingrediente) =>
    form.ingredientes.includes(Number(ingrediente.IdIngrediente)),
  );

  const actualizarIngredientesSeleccionados = (_, nuevosIngredientes) => {
    const ids = [
      ...new Set(
        nuevosIngredientes.map((ingrediente) =>
          Number(ingrediente.IdIngrediente),
        ),
      ),
    ];
    setForm((actual) => ({ ...actual, ingredientes: ids }));
  };

  const guardarProducto = (event) => {
    event.preventDefault();

    const idsCatalogo = new Set(
      catalogoIngredientes.map((ingrediente) =>
        Number(ingrediente.IdIngrediente),
      ),
    );
    if (
      form.ingredientes.some((idIngrediente) => !idsCatalogo.has(idIngrediente))
    ) {
      toast.error(t("adminProducts.invalidIngredient"));
      return;
    }

    const accion = form.IdProducto
      ? ProductoService.updateProducto(form)
      : ProductoService.createProducto(form);

    accion
      .then(() => {
        toast.success(
          form.IdProducto
            ? t("adminProducts.updated")
            : t("adminProducts.created"),
        );
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) =>
        toast.error(
          t("admin.saveError", {
            message: err.response?.data?.mensaje || err.message,
          }),
        ),
      );
  };

  const eliminarProducto = (idProducto) => {
    ProductoService.deleteProducto(idProducto)
      .then(() => {
        toast.success(t("adminProducts.deleted"));
        cargarDatos();
      })
      .catch((err) => toast.error(t("admin.deleteError", { message: err.message })));
  };

  const restaurarProducto = (idProducto) => {
    ProductoService.restoreProducto(idProducto)
      .then(() => {
        toast.success(t("adminProducts.restored"));
        cargarDatos();
      })
      .catch((err) => toast.error(t("admin.restoreError", { message: err.message })));
  };

  if (!loaded) return <p>{t("commonExtra.loading")}</p>;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" color="primary.main" gutterBottom>
        {t("headerExtra.productMaintenance")}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t("adminProducts.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            sx={{ borderRadius: 2, position: "sticky", top: 16 }}
          >
            <CardContent component="form" onSubmit={guardarProducto}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  {form.IdProducto
                    ? t("adminProducts.editProduct")
                    : t("adminProducts.newProduct")}
                </Typography>
                <TextField
                  label={t("adminUsers.name")}
                  name="Nombre"
                  value={form.Nombre}
                  onChange={actualizarCampo}
                  required
                  fullWidth
                />
                <TextField
                  label={t("common.category")}
                  name="IdCategoria"
                  value={form.IdCategoria}
                  onChange={actualizarCampo}
                  required
                  select
                  fullWidth
                >
                  {categorias.map((categoria) => (
                    <MenuItem
                      key={categoria.IdCategoria}
                      value={categoria.IdCategoria}
                    >
                      {categoria.Nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={t("common.description")}
                  name="Descripcion"
                  value={form.Descripcion}
                  onChange={actualizarCampo}
                  multiline
                  minRows={3}
                  fullWidth
                />
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  options={catalogoIngredientes}
                  value={ingredientesSeleccionados}
                  onChange={actualizarIngredientesSeleccionados}
                  getOptionLabel={(ingrediente) => ingrediente.Nombre}
                  isOptionEqualToValue={(option, value) =>
                    Number(option.IdIngrediente) === Number(value.IdIngrediente)
                  }
                  renderTags={(seleccionados, getTagProps) =>
                    seleccionados.map((ingrediente, index) => {
                      const { key, ...chipProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          label={ingrediente.Nombre}
                          {...chipProps}
                        />
                      );
                    })
                  }
                  noOptionsText={t("adminProducts.noIngredients")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("adminProducts.searchIngredients")}
                      placeholder={t("adminProducts.searchPlaceholder")}
                      helperText={t("adminProducts.ingredientsHelp")}
                    />
                  )}
                />
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    disabled={subiendoImagen}
                  >
                    {subiendoImagen
                      ? t("adminProducts.uploading")
                      : t("admin.image")}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={subirImagen}
                    />
                  </Button>
                  <TextField
                    label={t("adminProducts.imageInUploads")}
                    name="Imagen"
                    value={form.Imagen}
                    onChange={actualizarCampo}
                    helperText={t("adminProducts.imageHelp")}
                    fullWidth
                  />
                </Stack>
                <TextField
                  label={t("common.price")}
                  name="Precio"
                  value={form.Precio}
                  onChange={actualizarCampo}
                  type="number"
                  required
                  fullWidth
                />
                {form.Imagen && (
                  <Box
                    component="img"
                    src={`${BASE_URL}/${form.Imagen}`}
                    alt={form.Nombre}
                    sx={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                )}
                <Stack direction="row" spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon />}
                    fullWidth
                    sx={{ fontWeight: 700 }}
                  >
                    {t("admin.save")}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={limpiarFormulario}
                    fullWidth
                  >
                    {t("admin.new")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "primaryLight.main" }}>
                  <TableCell>{t("adminProducts.image")}</TableCell>
                  <TableCell>{t("commonExtra.item")}</TableCell>
                  <TableCell>{t("common.category")}</TableCell>
                  <TableCell align="right">{t("common.price")}</TableCell>
                  <TableCell>{t("commonExtra.status")}</TableCell>
                  <TableCell align="right">{t("admin.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.IdProducto} hover>
                    <TableCell sx={{ width: 88 }}>
                      <Box
                        component="img"
                        src={`${BASE_URL}/${producto.Imagen}`}
                        alt={producto.Nombre}
                        sx={{
                          width: 64,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {producto.Nombre}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block", maxWidth: 260 }}
                      >
                        {producto.Descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>{producto.Categoria}</TableCell>
                    <TableCell align="right">₡{producto.Precio}</TableCell>
                    <TableCell>
                      <Chip
                        label={producto.Estado ? t("admin.active") : t("admin.inactive")}
                        size="small"
                        color={producto.Estado ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => editarProducto(producto)}
                        >
                          {t("admin.edit")}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => eliminarProducto(producto.IdProducto)}
                        >
                          {t("admin.delete")}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
            {t("adminProducts.disabledProducts")}
          </Typography>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "primaryLight.main" }}>
                  <TableCell>{t("adminProducts.image")}</TableCell>
                  <TableCell>{t("commonExtra.item")}</TableCell>
                  <TableCell>{t("common.category")}</TableCell>
                  <TableCell align="right">{t("common.price")}</TableCell>
                  <TableCell>{t("commonExtra.status")}</TableCell>
                  <TableCell align="right">{t("admin.actions")}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productosEliminados.map((producto) => (
                  <TableRow key={producto.IdProducto} hover>
                    <TableCell sx={{ width: 88 }}>
                      <Box
                        component="img"
                        src={`${BASE_URL}/${producto.Imagen}`}
                        alt={producto.Nombre}
                        sx={{
                          width: 64,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {producto.Nombre}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block", maxWidth: 260 }}
                      >
                        {producto.Descripcion}
                      </Typography>
                    </TableCell>

                    <TableCell>{producto.Categoria}</TableCell>

                    <TableCell align="right">₡{producto.Precio}</TableCell>

                    <TableCell>
                      <Chip label={t("admin.inactive")} size="small" color="default" />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={() => restaurarProducto(producto.IdProducto)}
                      >
                        {t("admin.restore")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
