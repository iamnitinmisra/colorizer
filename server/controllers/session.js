const hri = require("human-readable-ids").hri;

module.exports = {
  init: (req, res) => {
    const { name, room, newRoom } = req.body;
    req.session.user = {
      color: "#000000",
      thickness: "3",
      name
    };
    if (newRoom) {
      req.session.user.room = hri.random();
    } else {
      req.session.user.room = room;
    }
    res.status(200).send(req.session.user);
  },
  setUser: (req, res) => {
    const { name, color, room, thickness } = req.body;
    if (name) req.session.user.name = name;
    if (color) req.session.user.color = color;
    if (thickness) req.session.user.thickness = thickness;
    if (room) req.session.user.room = room;

    // console.log(req.session.user);
    res.status(200).send(req.session.user);
  }
};
