/* 
    helper functions used in mutliple components
*/

// hotdogCard, hotdogDetailsDialog - formats seconds to a readable date ("DD Month YYYY")
function secondsToDate(s) {
    var date = new Date(1970, 0, 1);
    date.setTime(s * 1000);
    return date.getDate() + " " + (date.toLocaleString('default', {month: 'long'})) + ", " + date.getFullYear();
}

export {
    secondsToDate,
}
