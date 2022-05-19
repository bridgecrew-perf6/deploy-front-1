export function handleFormatDate(date) {
    return new Date(date).toLocaleDateString('pt-br').replace('-', '/')
}

export function handleFormatDayOfWeek(date) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dateId = new Date(date).getDay();
    return days[dateId];
}