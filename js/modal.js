function formatList(list)
{
    var listInStr;
    var count = 0;

    list.forEach (item => {
        if(count == 0){
            listInStr = item;
        }
        else{
            listInStr += ", " + item;
        }
        count += 1;
    });
    
    return listInStr;
}

function initElement(content, balise = "p")
{
    var element = document.createElement(balise);
    element.textContent = content;

    return element;
}

function createPosterFigure(json){
    var poster = document.createElement("figure");
    poster.style.cssText = "background-image: url(" + json.image_url + ")";

    return poster;
}

function insertChildrenElements(children)
{   
    var parent = document.createElement("div");
    children.forEach( child => {
        parent.appendChild(child)
    })

    return parent;
}

function createModalHeader(json){
    const modalTitle = initElement(json.title, "h5");

    var dateAndGenreContent = json.year + " - " + formatList(json.genres);
    const dateAndGenre = initElement(dateAndGenreContent)

    var pgAndDurationContent = "PG-" + json.rated + " - " + json.duration + " minutes";
        + "(" +  formatList(json.countries) + ")";
    const pgAndDuration = initElement(pgAndDurationContent);

    const score = initElement("IMDB score: " + json.imdb_score + "/10");    
    const directorsTitle = initElement("Réalisé par :");
    const directors = initElement(formatList(json.directors));

    const childrenList = [modalTitle, dateAndGenre, pgAndDuration, score, directorsTitle, directors];
    const headerInfo = insertChildrenElements(childrenList);

    const poster = createPosterFigure(json);

    return insertChildrenElements([headerInfo, poster]);
}

function createModalBody(json)
{
    const pitch = initElement(json.long_description);
    const poster = createPosterFigure(json);
    const withTitle = initElement("Avec:");
    const actors = initElement(formatList(json.actors));

    var returnButton = initElement("Fermer", "div");
    returnButton.classList.add("closeButton");
    returnButton.classList.add("movieDetailButton");

    const childrenList = [pitch, poster, withTitle, actors, returnButton]

    return insertChildrenElements(childrenList)
}

function displayModal(event)
{
    event.preventDefault
    fetch(titlesUrl + this.getAttribute("data-id"))
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        console.log(json.id);
        console.log(json.genres);
        var modal = document.querySelector("#modal");
        modal.removeChild(modal.querySelector("div"));

        const modalHeader = createModalHeader(json);
        const modalBody = createModalBody(json);

        var modalBox = document.createElement("div");
        modalBox.appendChild(modalHeader);
        modalBox.appendChild(modalBody);
        // modalHeader.addId("#modalHeader");

        modal.appendChild(modalBox);
    });
};

const detailsButtons = document.querySelectorAll(".movieDetailButton");

detailsButtons.forEach(item => {
    item.addEventListener("click", displayModal)
});