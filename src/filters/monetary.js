export function monetaryBrlFilter(value) {
    return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

export function monetarySmartsFilter(value) {
    return value.toLocaleString('pt-br', {minimumFractionDigits: 2  });
}

export function percentValue(value){
    return value + '%';
}