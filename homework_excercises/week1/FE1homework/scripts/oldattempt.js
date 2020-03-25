const allNodes = document.body.getElementsByTagName('*');

function byTagName(node, tagName) {
for (let i = 0; i < allNodes.length; i++){
    console.log(allNodes[i].nodeType)
}
}

//     let childNodes = node.childNodes,
//         children = [],
//         i = childNodes.length;

//     while (i--) {
//         if (childNodes[i].nodeType == 1) {
//             children.unshift(childNodes[i]);
//             console.log(childNodes[i].nodeName);
//         }
//     }

//     return children;
//   }

  console.log(byTagName(document.body, "h1").length);
  // → 1
  console.log(byTagName(document.body, "span").length);
  // → 3
  let para = document.querySelector("p");
  console.log(byTagName(para, "span").length);
  // → 2
