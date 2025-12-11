
 export default class GeralController {
 
    constructor() {
        this.home = async (req, res) => {
          res.render('index')
        };

        this.admin = async (req, res) => {
          res.render('admin')
        };

        this.cliente = async (req, res) => {
          res.render('cliente')
        };

        this.teste = async (req, res) => {
          const resultado = "teste";
          res.render('index2',{teste: resultado});
        };

        this.formulario = async (req, res) => {
          res.render('index')
        };

    }
 }

