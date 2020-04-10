module.exports = {
  setType: role_id => {
    if (role_id == 0) return "student";
    else if (role_id == 1) return "assistant";
    else if (role_id == 2) return "doctor";
    else if (role_id == 3) return "admin";
  }
};
