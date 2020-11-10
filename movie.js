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
    container;

function preload() {
    const location = new URL(window.location),
        url = new URL('https://www.omdbapi.com/'),
        movieId = location.searchParams.get('id');

    url.searchParams.set('apikey', '9c88f358');
    url.searchParams.set('i', movieId);

    movie = loadJSON(url);
}

function setup() {
    noCanvas();

    console.log(movie);

    let hasRatings = movie.imdbRating !== "N/A"

    /**
     * @type {number}
     */
    let averageRating = !hasRatings ? 0 : movie.Ratings.reduce((tot, rating) => {
        if (rating.Source === "Rotten Tomatoes") {
            let r = rating.Value.match(/([0-9.]*)%/i);
            console.log(r)

            return tot + Number(r[1]);
        } else if (rating.Source === "Internet Movie Database") {
            return tot + (movie.imdbRating * 10);
        } else if (rating.Source === "Metacritic") {
            let r = rating.Value.match(/([0-9\.]*)\/100/i);
            console.log(r)
            return tot + Number(r[1]);
        }
    }, 0) / movie.Ratings.length;

    averageRating = floor(averageRating)
    console.log(averageRating)
    document.title = movie.Title;

    container = createDiv()
        .addClass('row')
        .parent(
            createDiv().addClass('container')
        )

    let imgUrl = movie.Poster !== "N\\A" ? movie.Poster : false,
        bg = './assets/';

    if (averageRating > 80) {
        bg += 'oscar'
    } else if (averageRating > 55) {
        bg += 'nice'
    } else {
        bg += 'doubt'
    }

    bg += '.webp';

    select('body')
        .style('background-image', 'url(' + bg + ')')
        .style('background-size', 'cover')
        .style('background-repeat', 'no-repeat')
        .style('background-position', 'center')
        .style('min-height', '100vh')
        .addClass('valign-wrapper')


    let card = createDiv()
        .addClass('card');

    card.child(
        createDiv()
            .addClass('card-image')
            .child(
                createElement('img')
                    .attribute('src', imgUrl)
            )
    );

    card
        .child(
            createDiv().addClass('card-content')
                .child(
                    createSpan(movie.Title + ' (' + movie.Year + ')').addClass('card-title')
                )
                .child(
                    createP(movie.Plot)
                )
        );

    createCol('s12 m6 l4 offset-l1 ').parent(container).child(card)

    let myComm = createDiv()
        .addClass('card-panel')
        .style('background-color', 'unset')
        .style('box-shadow', 'unset')
        .style('-webkit-box-shadow', 'unset')

        .parent(
            createCol('s12 m6 l4 offset-l1 card valign-wrapper')
                .style('min-height', '100%')
                .style('background-color', 'rgba(244, 255, 129,.8')


        )
        .child(
            createElement('h1', 'Thank you!')
                .style('margin-top', '1rem')
        );

    myComm.child(
        createP('<i><strong>' + movie.Title + '</strong></i> sounds like a wonderful movie! I\'ll watch it ASAP!')
            .addClass('flow-text')
    )

    if (hasRatings) {
        myComm.child(
            createP("The average rating is:")
        )
            .child(
                createElement('h4', averageRating + "/100")
                    .style('text-align', 'center')
                    .style('margin-bottom', '2rem')
            )
    }


}


function createCol(className = 's12') {
    return createDiv()
        .class('col ' + className)
        .parent(container)
}
