 const tryCatch = (controller) => async (req, res) => {
  try {
    await controller(req, res);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `server not found ${err}` });
      
  }
};

export default tryCatch