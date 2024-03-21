const titlesUrl = "http://localhost:8000/api/v1/titles/";
const genresUrl = "http://localhost:8000/api/v1/titles/?genre=";
const genresCategoryUrl = "http://localhost:8000/api/v1/genres/";
const pageSize = 6;
const firstOther = 0;
const secondOther = 1;

var count = 0;

fetch(titlesUrl + "?sort_by=-imdb_score&page_size=1")
.then((response) => {
    return response.json();
})
.then((json) => {
    const bestMovie = json.results[0];
    document.querySelector("#bestMoviePicture").style.cssText = "background-image: url(" + bestMovie.image_url + ")";
    document.querySelector("#bestMovieTitle").innerText = bestMovie.title;

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
        figure.style.cssText = "background-image: url(" + jsonResults[figureCount].image_url + ")";
        figure.querySelector("h4").innerText = jsonResults[figureCount].title;
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
        unzipFigure(categoryBox, json.results)
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

function allGenresListCall(personalizedCategory, displayIndex)
{
    fetch(genresCategoryUrl).then((response) => {
        return response.json();
    })
    .then((json) => {

        fetch(genresCategoryUrl + "?page_size=" + json.count)
        .then((resp) => {
            return resp.json();            
        })
        .then((json) => {
            categoriesBox = personalizedCategory.querySelector(".categoryListBox");

            for(genre of json.results){
                optionElement = document.createElement("option")
                optionElement.value = genre.name.charAt(0).toLowerCase() + genre.name.slice(1);
                optionElement.innerText = genre.name;
                if(displayIndex == count)
                {
                    console.log(displayIndex)
                    optionElement.classList.add("otherCategoryShow")
                }
                categoriesBox.appendChild(optionElement);
            };

            otherCategoryCall(json.results[count].name, personalizedCategory);  
            count += 1;

            if(count == 2){
                count = 0;
            }       
        });
    });
};

const firstCategory = document.querySelector("#firstCategory");
const secondCategory = document.querySelector("#secondCategory");
const thirdCategory = document.querySelector("#thirdCategory");
const forthCategory = document.querySelector("#forthCategory");
const fifthCategory = document.querySelector("#fifthCategory");

genreCategoryCall("animation", firstCategory);
genreCategoryCall("mystery", secondCategory);
genreCategoryCall("fantasy", thirdCategory);

allGenresListCall(forthCategory, firstOther);
allGenresListCall(fifthCategory, secondOther);





