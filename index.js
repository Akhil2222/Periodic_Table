function getElements(attr,property,includes){
    let arr = []
    for(let i in periodic){
        if(periodic[i][attr] == property){
            arr.push(Number(i))
            continue;
        }
        if(includes && !periodic[i][attr].toString().search(property)){
            arr.push(Number(i))
        }
    }
    return arr
}
function generateHTML(eID){
    let element = periodic[eID]
    return `    
        <div class="element border border-white border-1 rounded p-1 m-0 ${eID}">
            <p class='top'>
                <span class="left">${eID+1}</span>
                <span class="right">${Math.round(element.atomic_mass*100)/100}</span>
            </p>
            <h1 class="text-center">${element.symbol}</h1>
            <p class="text-center">${element.name}</p>
        </div>
    `
}
for(let i in periodic[0]){
    if(['xpos','ypos','wxpos','wypos','image','cpk-hex'].includes(i)){
        continue
    }
    $('#info').append(`<option value='${i}'>${i.split('_').map(a=>a.toLowerCase()).join(' ')}</option>`)
}
let valence = ['IA',"IIA",'IIIB',"IVB","VB","VIB","VIIB",'VIIIB',"VIIIB","VIIIB","IB","IIB","IIIA","IVA","VA",'VIA','VIIA','VIIIA']
let table = Array.from(new Array(10).keys()).map(a=>new Array(18));
for(let i = 1;i <= table.length;i++){
    let newarr = getElements("ypos",i)
    console.log(newarr)
    for(let j of newarr){
        table[i-1][periodic[j].xpos-1] = `<td>${generateHTML(j)}</td>`;
    }
    for(let j = 0;j < 18;j++){
        if(!table[i-1][j]){
            table[i-1][j] = `<td></td>`
        }
    }
}
document.body.innerHTML += `
<table class='container-fluid'>
    <tbody>
        <tr id='group' width="900"><td>${valence.map((a,b)=>`
            <td class='text-center'>
                <h6 class='col'>${b+1}</h6>
                <h6 class='col'>${a}</h6>
            </td>`
        ).join('')}</tr>
        ${table.map((a,b)=>`<tr width="900">${b<7?`<td class='period text-end m-0'>${b+1}</td>`:'<td></td>'}${a.join('')}</tr>`).join('')}
    </tbody>
</table>`
let size = Math.min(Math.floor(innerHeight/12),Math.floor(innerWidth/20))
$('#group').css({
    'height':'0px'
})
$('#group > *').css({
    'height':'0px'
})
$('#name').on('input',function({target}){
    let val;
    if(target.value){
        val = target.value[0].toUpperCase() + target.value.slice(1).toLowerCase()
    }
    if(!isNaN(Number(val))){
        let atoms = getElements('number',val,false)
        for(let i = 0;i < 118;i++){
            if(atoms.includes(i)){
                $(`.${i}`).css({'background-color':'black'})
            }else{
                $(`.${i}`).css({'background-color':'white'})
            }
        }
        return;
    }
    let elems = getElements('name',val,true);
    let symbs = getElements('symbol',val,true);
    console.log(elems,symbs,val)
    for(let i = 0;i < 118;i++){
        if(elems.includes(i) || symbs.includes(i)){
            $(`.${i}`).css({'background-color':'black'})
        }else{
            $(`.${i}`).css({'background-color':'white'})
        }
    }
})
$('.element').on('click',function(){
    let id = this.className.slice(53)
    $('#selectedElement').text(periodic[id].name);
    giveAnswer()
})
$('#info').on('change',giveAnswer)
function giveAnswer(){
    console.log($('#info').val(),$('#selectedElement').text())
    let ret = periodic[getElements("name",$('#selectedElement').text(),false)][$("#info").val()]
    console.log(ret,$('#answer'))
    if(typeof ret != 'object'){
        if(ret.toString().slice(0,4) == 'http'){
            $('#answer').html(`is: <a href=${ret}>this</a>`)
        }else{
            $('#answer').html('is: ' + ret)
        }
    }else{
        if(ret.length > 1){
            ret = ret.map(a=>a.toString())
            ret[ret.length-1] = 'and ' + ret.at(-1)
            $('#answer').html('are: ' + ret.join(', '))
        }else{
            $('#answer').html('is: ' + ret.join(', '))
        }
    }
}