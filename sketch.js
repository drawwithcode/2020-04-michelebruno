/**
 * OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=9c88f358
 */
let title,
    container,
    input,
    searchString,
    /** @type Promise */ request,
    /** @type AbortController */controller,
    speech,
    micButton,
    collectionUl;

function setup() {
    // put setup code here

    noCanvas();

    container = createDiv().addClass('container');

    title = createElement('h1', 'What\'s your favourite movie?')

    createCol('s12')
        .child(title)

    input = createInput(undefined, 'text')
        .attribute('placeholder', 'Title to search')
        .input(onTitleChange)

    if (typeof webkitSpeechRecognition !== "undefined") {
        if (!speech) {
            speech = new p5.SpeechRec('it')
            speech.onEnd = () => {
                input.value(speech.resultString)
                searchOnOMDB(speech.resultString)
            }

        }
        micButton = createButton('<i class="material-icons">mic</i>')
            .addClass('btn-floating btn-large waves-effect waves-light red')
            .mouseClicked(() => {
                speech.start()

            })
    }
    createCol()
        .child(input, micButton)

    collectionUl = createElement('ul')
        .addClass('collection')
        .hide()

    createCol()
        .child(collectionUl)


}

function onTitleChange() {
    let v = this.value()
    console.log(v)

    searchOnOMDB(v)
}

function searchOnOMDB(title) {

    if (controller)
        controller.abort()
    controller = new AbortController()

    let url = new URL('http://www.omdbapi.com/')

    url.searchParams.set('s', title);
    // The API key should not be public... it's the only way so far.
    url.searchParams.set('apikey', '9c88f358');
    url.searchParams.set('type', 'movie');

    request = fetch(url.toString(), {signal: controller.signal})
        .then(r => r.json())
        .then(({Search}) => {
            removeCollectionChildren()
            Search.forEach(movie => {
                let l = createElement('li')
                    .addClass('collection-item')

                l.child(
                    createDiv('<h4>' + movie.Title + '</h4>')
                        .child(
                            createA('./movie.html?t=' + movie.imdbID, '<i class="material-icons">send</i>')
                                .addClass('secondary-content')
                        )
                )

                collectionUl.child(l)

            })

            collectionUl.show()

        })
        .catch(err => null)
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