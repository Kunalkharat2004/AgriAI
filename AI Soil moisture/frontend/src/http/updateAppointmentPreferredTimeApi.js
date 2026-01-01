export const updateAppointmentPreferredTimeApi = async (payload) => {
  return api.put("/appointments/preferred-time", payload);
};
