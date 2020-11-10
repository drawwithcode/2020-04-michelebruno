/**
 * OMDb API: http://www.omdbapi.com/?apikey=9c88f358
 */

/** @typedef {Object} Movie
 * @property {String} Actors
 * @property {String} Awards
 * @property {String} BoxOffice
 * @property {String} Country
 * @property {String} DVD
 * @property {String} Director
 * @property {String} Genre
 * @property {String} Language
 * @property {String} Metascore
 * @property {String} Plot
 * @property {String} Poster
 * @property {String} Production
 * @property {String} Rated
 * @property {Rating[]} Ratings
 * @property {String} Released
 * @property {String} Response
 * @property {String} Runtime
 * @property {String} Title
 * @property {String} Type
 * @property {String} Website
 * @property {String} Writer
 * @property {String} Year
 * @property {String} imdbID
 * @property {String} imdbRating
 * @property {String} imdbVotes
 *
 * @typedef {Object} Rating
 * @property {String} Source
 * @property {String} Value
 *
 */
let /** @var {Movie} movie */ movie,
    container,
    row;

function preload() {
    const location = new URL(window.location),
        url = new URL('https://www.omdbapi.com/'),
        movieId = location.searchParams.get('id');

    url.searchParams.set('apikey', '9c88f358');
    url.searchParams.set('i', movieId);

    movie = loadJSON(url)
}

function setup() {
    noCanvas();

    console.log(movie)

    let averageRating = movie.Ratings.reduce((tot, rating) => {
        if (rating.Source === "Rotten Tomatoes") {
            let r = rating.Value.match(/([0-9\.]*)\%/i);
            return tot + Number(r[1]);
        } else if (rating.Source === "Internet Movie Database") {
            return tot + (movie.imdbRating * 10);
        } else if (rating.Source === "Metacritic") {
            let r = rating.Value.match(/([0-9\.]*)(?=\/100)/i);
            return tot + Number(r[0]);
        }
    }, 0) / movie.Ratings.length;

    console.log("averega rating", averageRating)

    document.title = movie.Title;

    container = createDiv().addClass('')
        .child(
            row = createDiv().class('row')
        )

    let imgUrl = movie.Poster !== "N\\A" ? movie.Poster : false;

    if (imgUrl) {

        createCol('s12 l6')
            .style('background-image', 'url(./assets/oscar.webp)')
            .style('background-size', 'contain')
            .style('background-repeat', 'no-repeat')
            .style('background-position', 'center')
            .style('min-height', 'calc(100vh - 20px)')
    }
    createCol('s12 l6')
        .child(
            createElement('h1','Thank you!')
        )
        .child(
            createP('<i><strong>' + movie.Title + '</strong></i> sounds like a wonderful movie! I\'ll watch it ASAP')
        )


}


function createCol(className = 's12') {
    return createDiv()
        .class('col ' + className)
        .parent(row)
}
