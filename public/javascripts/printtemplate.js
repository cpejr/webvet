/* Creating the grid */
function grid(el) {
    var container = document.createElement("div");
    container.id = "main";
    container.className = "printcontainer";

    for (i=0; i<16; i+=1) {
        var row = document.createElement("div");
        row.className = "printrow";
        row.id = "printrow" + i;

        for (k=0; k<16; k+=1) {
            var box = document.createElement("div");
            box.className = "printbox";
            row.appendChild(box);
        };

        container.appendChild(row);
    };

    el.appendChild(container);
};

grid(document.body);
