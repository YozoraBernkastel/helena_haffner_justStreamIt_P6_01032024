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
    poster.classList.add("modalPicture");

    return insertChildrenElements([headerInfo, poster]);
}

function createModalBody(json)
{
    const pitch = initElement(json.long_description);
    const poster = createPosterFigure(json);
    const withTitle = initElement("Avec:");
    const actors = initElement(formatList(json.actors));

    var returnButton = initElement("Fermer", "div");
    returnButton.setAttribute("id","closeButton");
    returnButton.classList.add("movieDetailButton");
    closeModalButton = returnButton;
    closeModalButton.addEventListener("click", closeModal);

    const childrenList = [pitch, poster, withTitle, actors, returnButton]

    return insertChildrenElements(childrenList)
}

function displayModal(event)
{
    event.preventDefault;
    fetch(titlesUrl + this.getAttribute("data-id"))
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        var modal = document.querySelector("#modal");
        modal.removeChild(modal.querySelector("div"));
        modal.style.cssText = "display : block";

        const modalHeader = createModalHeader(json);
        modalHeader.setAttribute("id", "modalHeader");
        const modalBody = createModalBody(json);
        modalBody.setAttribute("id", "modalBody");
        var modalBox = insertChildrenElements([modalHeader, modalBody]);

        modal.appendChild(modalBox);
    });
};

function closeModal(event)
{
    event.preventDefault
    var modal = document.querySelector("#modal");
    modal.style.cssText = "display : none";
}

const detailsButtons = document.querySelectorAll(".movieDetailButton");

detailsButtons.forEach(item => {
    item.addEventListener("click", displayModal)
});
