const titlesUrl = "http://localhost:8000/api/v1/titles/";
const genresUrl = "http://localhost:8000/api/v1/titles/?genre=";
const genresCategoryUrl = "http://localhost:8000/api/v1/genres/";
const pageSize = 6;
const firstOther = 0;
const secondOther = 1;

var forthActiveGenre = "";
var fifthActiveGenre = "";

var count = 0;

fetch(titlesUrl + "?sort_by=-imdb_score&page_size=1")
.then((response) => {
    return response.json();
})
.then((json) => {
    const bestMovie = json.results[0];
    document.querySelector("#bestMoviePicture").style.cssText = "background-image: url(" + bestMovie.image_url + ")";
    document.querySelector("#bestMovieTitle").innerText = bestMovie.title;
    document.querySelector("#bestMovieDetailButton").setAttribute("data-id",bestMovie.id);

    fetch(titlesUrl + json.results[0].id)
    .then((resp) => {
        return resp.json();
    })
    .then((json) => {
        document.querySelector("#bestMovieDescription").innerText = json.description;
    });
});

function unzipFigure(categoryBox, jsonResults)
{
    const allFigure = categoryBox.querySelectorAll("figure");
    var figureCount = 0;

    allFigure.forEach(figure => {

        if(figureCount < jsonResults.length){
        
            figure.style.cssText = "background-image: url(" + jsonResults[figureCount].image_url + ")";
            figure.querySelector("h4").innerText = jsonResults[figureCount].title;
            figure.querySelector(".movieDetailButton").setAttribute("data-id", jsonResults[figureCount].id)
        }   
        else{
            figure.querySelector("div").style.cssText = "display: none";
            figure.style.cssText = "background-image: none";
            figure.classList.add("endOfList");
        }     
        figureCount += 1;
    });
}

function genreCategoryCall(genre, categoryBox)
{
    fetch(genresUrl + genre + "&sort_by=-imdb_score&page_size=" + pageSize)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        const h2Element = categoryBox.querySelector("h2");
        // Upper case on the first letter of the genre in entry
        h2Element.innerText = genre.charAt(0).toUpperCase() + genre.slice(1);
        
        unzipFigure(categoryBox, json.results);
    });
};

function otherCategoryCall(genre, personalizedCategory)
{
    fetch(genresUrl + genre + "&sort_by=-imdb_score&page_size=" + pageSize)
    .then((response) => {
        return response.json();
    }).then((json) => {
        unzipFigure(personalizedCategory, json.results);
    });
};

function trackerUpdate(categoriesBox, selectedElement, elementLocation)
{
    categoriesBox.value = selectedElement;

    if(elementLocation == "forth"){
         forthActiveGenre = selectedElement;
    }

    if(elementLocation == "fifth"){
        fifthActiveGenre = selectedElement;
    }

    count += 1;
    if(count == 2){
        count = 0;
    }       
}

function allGenresListCall(personalizedCategory, elementLocation)
{
    fetch(genresCategoryUrl)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        fetch(genresCategoryUrl + "?page_size=" + json.count)
        .then((resp) => {
            return resp.json();            
        })
        .then((json) => {
            const categoriesBox = personalizedCategory.querySelector(".categoryListBox");

            for(genre of json.results){
                optionElement = document.createElement("option")
                optionElement.value = genre.name.charAt(0).toLowerCase() + genre.name.slice(1);
                optionElement.innerText = genre.name;
                categoriesBox.appendChild(optionElement);
            };

            otherCategoryCall(json.results[count].name, personalizedCategory); 
            const selectedElement = json.results[count].name.charAt(0).toLowerCase() + json.results[count].name.slice(1)
            trackerUpdate(categoriesBox, selectedElement, elementLocation)    
        });
    });
};

function changeCategory(event)
{
    event.preventDefault();

    const greatParent = this.parentElement.parentElement;

    if(greatParent == forthCategory && forthActiveGenre != this.value)
    {
        forthActiveGenre = this.value;
        otherCategoryCall(this.value, greatParent);
    }

    if(greatParent == fifthCategory && fifthActiveGenre != this.value)
    {
        fifthActiveGenre = this.value;
        otherCategoryCall(this.value, greatParent);
    }
}

function toggleSeeMore(event)
{
    event.preventDefault();

    const parent = this.parentElement;
    const cadres = parent.querySelectorAll(".cadre");
    const lastCadre = cadres[cadres.length - 1];

    if (lastCadre.classList.contains("endOfList"))
    {
        return;
    }

    parent.classList.toggle("showAll");

    if(this.innerText == "Voir plus")
    {
        this.innerText = "Voir moins";
    }
    else{
        this.innerText = "Voir plus";
    }
}

const firstCategory = document.querySelector("#firstCategory");
const secondCategory = document.querySelector("#secondCategory");
const thirdCategory = document.querySelector("#thirdCategory");
const forthCategory = document.querySelector("#forthCategory");
const fifthCategory = document.querySelector("#fifthCategory");

const forthCategoryMenu = document.querySelector("#forthCategory .categoryListBox");
const fifthCategoryMenu = document.querySelector("#fifthCategory .categoryListBox");

const seeMoreButtons = document.querySelectorAll(".seeMoreButton");

genreCategoryCall("animation", firstCategory);
genreCategoryCall("mystery", secondCategory);
genreCategoryCall("fantasy", thirdCategory);

allGenresListCall(forthCategory, "forth");
allGenresListCall(fifthCategory, "fifth");

forthCategoryMenu.addEventListener("click", changeCategory);
fifthCategoryMenu.addEventListener("click", changeCategory);

seeMoreButtons.forEach(item => {
    item.addEventListener("click", toggleSeeMore)
});

