const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const XLSX=require('../dist/xlsx.mini.min.js');
const nodes=new Map();
function node(){return {value:'',checked:false,disabled:false,hidden:false,style:{},children:[],setAttribute(){},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},setCustomValidity(s){this.error=s},reportValidity(){},showModal(){this.open=true},close(){this.open=false},focus(){},reset(){},click(){}}}
const ctx={document:{getElementById(id){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},createElement:node},localStorage:{getItem:()=>JSON.stringify([{id:'legacy',title:'Old series',type:'Series',genre:'Drama',notes:'',watched:3,total:12,status:'Watching'}]),setItem(){}},crypto:require('node:crypto').webcrypto,URL,Blob,setTimeout,clearTimeout,confirm:()=>true,XLSX,console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);
const evaluate=code=>vm.runInContext(code,ctx);
assert.equal(evaluate('items.length'),1,'legacy data survives migration');
evaluate("const ongoing={id:'live',title:'One Piece',type:'Anime',genre:'Adventure',notes:'Hi',watched:1150,total:null,status:'Watching',url:'https://example.com/watch',updated:1700000000000};");
assert.equal(evaluate('!!valid(ongoing)'),true);assert.equal(evaluate("!!valid({...ongoing,url:'javascript:alert(1)'})"),false);assert.equal(evaluate('!!valid({...ongoing,total:4})'),false);
evaluate('items=[ongoing];render()');
const card=nodes.get('grid').children[0],content=card.children[1],actions=content.children.at(-1),plus=actions.children[0];assert.equal(plus.disabled,false);plus.onclick();assert.equal(evaluate('items[0].watched'),1151);assert.equal(evaluate('items[0].total'),null);assert.equal(evaluate('items[0].status'),'Watching');
// Exercise the exact runtime XLSX writer/reader, including Unicode, blank totals, URLs, and notes.
evaluate("const finished={...ongoing,id:'fixed',title:'日本語 café',total:12,watched:12,status:'Completed',notes:'line one\\nline two'}; const book=excelBook([ongoing,finished]);const bytes=XLSX.write(book,{type:'array',bookType:'xlsx'});const result=readExcel(bytes);");
assert.equal(evaluate('result.length'),2);assert.equal(evaluate('result[0].total'),null);assert.equal(evaluate('result[0].url'),'https://example.com/watch');assert.equal(evaluate('result[1].notes'),'line one\nline two');assert.equal(evaluate('result[1].title'),'日本語 café');assert.equal(evaluate('readExcel(XLSX.write(excelBook([]),{type:"array",bookType:"xlsx"})).length'),0);
assert.throws(()=>evaluate("parseExcelRows([columns,['a','Bad','Series','',15,10,'No','Watching','','','']])"),/Row 2/);
assert.throws(()=>evaluate("parseExcelRows([columns,['a','Bad','Series','',0,'','Yes','Watching','javascript:alert(1)','','']])"),/Row 2/);
assert.equal(evaluate("mergeTitles([ongoing],[{...ongoing,id:'other',watched:5}]).length"),1);assert.equal(evaluate("mergeTitles([ongoing],[{...ongoing,id:'other',watched:5}])[0].id"),'live');
assert.equal(evaluate("parseExcelRows([['Title','Episodes watched'],['New ongoing',22]])[0].total"),null);
assert.throws(()=>evaluate("checkImport([ongoing,ongoing])"),/Duplicate/);
evaluate('open(ongoing)');assert.equal(nodes.get('total').disabled,true);assert.equal(nodes.get('ongoing').checked,true);
evaluate('open(finished)');assert.equal(nodes.get('total').disabled,false);assert.equal(nodes.get('ongoing').checked,false);
console.log('Passed: legacy data, ongoing increments, safe URLs, XLSX round-trip, empty workbook, row validation, merge, duplicate IDs, and edit form.');
