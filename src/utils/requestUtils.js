/**
 * Detecta si la solicitud actual es para una API
 * @param {object} req - Objeto de solicitud HTTP
 * @returns {boolean} - Retorna true si la solicitud es una API
 */
export const isApiRequest = (req) => {
  return req.headers.accept?.includes("application/json");
};
