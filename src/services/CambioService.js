import ResourceService from './ResourceService';

export default class CambioService extends  ResourceService {
    constructor() {
        super('/Cambio')
    }

    calculateSmartsGenerated(params){
        return this
        .$axios
        .get(this.getUrl('CalcularSmartsGerado'), { params });
    }

    calculateOfferValues(params){
        return this
        .$axios
        .get(this.getUrl('CalcularValores'), { params });
    }
}