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
 */
/** @typedef {Object} Rating
 * @property {String} Source
 * @property {String} Value
 */
let movie,
    container,
row;

function preload() {
    const location = new URL(window.location),
        url = new URL('http://www.omdbapi.com/'),
        movieId = location.searchParams.get('id');

    url.searchParams.set('apikey', '9c88f358');
    url.searchParams.set('i', movieId);

    movie = loadJSON(url)
}

function setup() {
    noCanvas();

    console.log(movie)

    document.title = movie.Title;

    container = createDiv().addClass('')
        .child(
            row = createDiv().class('row')
)

    let imgUrl = movie.Poster !== "N\\A" ? movie.Poster : false;

    if (imgUrl) {

        createCol('s12 l6')
            .style('background-image', 'url(' + imgUrl.replace(/SX300\.jpg$/i, '.jpg') + ')')
            .style('background-size', 'cover')
            .style('background-position', 'center')
            .style('min-height', '100vh')
    }
    createCol('')
        .child(
            createElement('h1', movie.Title)
        )


}


function createCol(className = 's12') {
    return createDiv()
        .class('col ' + className)
        .parent(row)
}
