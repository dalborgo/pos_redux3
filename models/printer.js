const ottoman = require("ottoman");
//var table = require("./table.js");
//ottoman.store = require("../server/server").store;

const stampante = ottoman.model("Stampante", {
        name: "string",
        ip: "string",
        categories: ['string']
    });
module.exports = stampante;