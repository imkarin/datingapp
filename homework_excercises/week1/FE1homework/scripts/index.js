function byTagName(node, tagName) {
  let wantedTag = tagName.toUpperCase();
  let c = node.getElementsByTagName("*");
  let x = [] ;
  
  for(let i = 0; i < c.length; i++) {
    if(c[i].tagName===wantedTag){ // add only nodes with the wanted tags to the array
      x.push(c[i]);
    }
  }
  
  return x
}
  
console.log(byTagName(document.body, "h1").length);
// → 1
console.log(byTagName(document.body, "span").length);
// → 3
let para = document.querySelector("p");
console.log(byTagName(para, "span").length);
// → 2