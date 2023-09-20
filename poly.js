function generateHTML(pID){
    return `<span class='row polyatomic mx-2 ${pID}'><b class='col-3 text-center'>${polyatomic[pID].formula}</b><span class='col'>${polyatomic[pID].name}</span></span>`
}
function getIons(attr,property,includes){
    let arr = []
    for(let i in polyatomic){
        if(polyatomic[i][attr] == property){
            arr.push(Number(i))
        }else if(includes && polyatomic[i][attr].search(property) == 0){
            arr.push(Number(i))
        }
    }
    return arr
}
let charges = []
for(let charge = -3;charge < 2;charge++){
    if(charge == 0){
        continue;
    }
    charges.push([`<h3 class='text-center'>${charge}</h3><hr/>`])
    let ions = getIons('charge',charge);
    for(let i of ions){
        charges[charges.length-1].push(generateHTML(i))
    }
}
let grandHTML = "<div class='row'>"
for(let i in charges){
    grandHTML += "<div class='col'>"
    grandHTML += charges[i].join('<br/>');
    grandHTML += "</div>"
}
grandHTML += "</div>"
document.body.innerHTML += grandHTML
$('#name').on('input',function(){
    let val = $("#name").val()
    let names = getIons("name",(val?val[0].toUpperCase() + val.slice(1):val),true)
    let formula = getIons("formula_simple",val.toUpperCase(),true);
    console.log(names,formula,val)
    for(let i = 0;i < $('.polyatomic').length;i++){
        if(names.includes(i) || formula.includes(i)){
            $(`.${i}`).css({'background-color':'black'})
        }else{
            $(`.${i}`).css({'background-color':'white'})
        }
    }
})