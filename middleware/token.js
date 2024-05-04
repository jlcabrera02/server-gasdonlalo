import auth from "../models/auth.model";
const { verificar } = auth;

export const verificarToken = (req, res, next) => {
  try {
    let user = verificar(req.headers.authorization, 5);
    if (!user.success) throw user;
    req.usuario = user.token.data.datos;
    req.permisos = user.token.data.permisos;
    next();
  } catch (err) {
    res.status(403).json(err);
  }
};
