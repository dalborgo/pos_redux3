import escpos from 'escpos';
import moment from 'moment'
import config from '../../config/config.json';
moment.locale('it');
// 33 chars type a
// 42 chars type b
function al(s, d, t=42) {
    let ns = t - s.length - d.length;
    let sp = '';
    for (let i = 0; i < ns; i++) {
        sp += ' ';
    }
    return s + sp + d;
}

const appRouter = function (app) {
    app.get("/api/print", function (req, res, next) {
        const device = new escpos.Network(config.printer.ip);
        //var device = new escpos.Console();
        const printer = new escpos.Printer(device);
        const obj = {
            data: moment(new Date()).format('llll').toUpperCase(),
            az: 'Asten Srl',
            user: 'fsfdsa',
            prod: 'Miscellaneous',
            quant: '1.000',
            costo: '18.00',
            subtotale: '18.00',
            total: '18.00',
            cash: '20.00',
            change: '2.00'
        };
        /*device.open(function () {
            printer
                .encode('850')
                .font('A')
                .align('lt')
                .text('123456789012345678901234567890123')
                .font('B')
                .text('123456789012345678901234567890123456789012')
                .flush();
        })*/
        device.open(function () {
            printer
                .encode('850')
                .font('B')
                .align('ct')
                .text(obj.data)
                .align('lt')
                .text(obj.az).text(obj.user)
                .text(al(obj.prod, obj.quant + '      ' + obj.costo))
                .text(al('Subtotal:', obj.subtotale)).size(1, 2).font('B').text(al('Total:', obj.total)).size().font('B')
                .text(al('Cash (EUR)', obj.cash))
                .text(al('Change:', obj.change)).flush()
        });
        res.send('Errore')
        //res.redirect('/pay')
    });
};
module.exports = appRouter;
