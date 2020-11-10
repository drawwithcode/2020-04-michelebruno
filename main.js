/**
 * OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9c88f358
 */
let title,
    container,
    input,
    /** @type Promise */ request,
    /** @type AbortController */controller,
    speech,
    micButton,
    collectionUl;

function setup() {
    // put setup code here
    noCanvas();

    container = createDiv()
        .addClass('row')
        .parent(
            createDiv().addClass('container')
        );

    title = createElement('h1', 'Let\'s talk about movies');

    createCol('s12')
        .child(title)
        .child(
            createP(
                "My roomates and I have been watching a lot of movies last days. Yes, we should have studied instead " +
                "but now we can tell you what we think about almost any movie!"
            )
        );

    input = createInput(undefined, 'text')
        .attribute('placeholder', 'Title to search')
        .input(onTitleChange)
        .parent(container)
        .addClass('col s10');

    // If browser supports SpeechRecognition, let's show a button to listen the movie title
    if (typeof webkitSpeechRecognition !== "undefined") {

        if (!speech) {
            speech = new p5.SpeechRec('it');
            speech.onEnd = () => {
                if (!speech.resultString)
                    return;

                input.value(speech.resultString);

                searchOnOMDB(speech.resultString);

                micButton.removeClass('pulse');
            }
        }

        micButton = createButton('<i class="material-icons">mic</i>')
            .addClass('btn-floating btn-large waves-effect waves-light red')
            .mouseClicked(() => {
                speech.start()
                micButton.addClass('pulse')
            })
            .parent(createDiv().addClass('col s2  right-align').parent(container))
    }

    collectionUl = createElement('ul')
        .addClass('collection')
        .hide();

    createCol()
        .child(collectionUl);
}

function onTitleChange() {
    input.removeClass('invalid')
    input.removeClass('valid')
    let v = this.value()

    searchOnOMDB(v)
}

function searchOnOMDB(title) {

    if (controller)
        controller.abort()
    controller = new AbortController()

    let url = new URL('https://www.omdbapi.com/')

    url.searchParams.set('s', title);
    // The API key should not be public... it's the only way so far.
    url.searchParams.set('apikey', '9c88f358');
    url.searchParams.set('type', 'movie');

    request = fetch(url.toString(), {signal: controller.signal})
        .then(r => r.json())
        .then(({Search, Response}) => {
            if (!Search || Response === "False")
                return input.addClass('invalid')

            input.addClass('valid')
            updateList(Search)
        })
        .catch(() => null)
}


function updateList(Search) {
    removeCollectionChildren()
    Search.forEach(movie => {
        let li = createElement('li')
            .addClass('collection-item avatar')
            .mousePressed(() => window.location = 'movie.html?id=' + movie.imdbID);

        createDiv(movie.Poster !== 'N/A' ? '<img src="' + movie.Poster.replace(/SX300\.jpg$/i, 'SX100.jpg') + '" />' : undefined)
            .parent(li)
            .child(
                createElement('h4', movie.Title)
            )

        collectionUl.child(li)

    })

    collectionUl.show()
}

function createCol(className = 's12') {
    return createDiv()
        .class('col ' + className)
        .parent(container)
}

function removeCollectionChildren() {
    selectAll('ul.collection > li')
        .forEach(l => l.remove())
}