const api = `https://api.lyrics.ovh`

const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()

} 

const fetchSongs = async term => {
    const data = await fetchData(`${api}/suggest/${term}`)
    insertSongsIntoPage(data)

}

const fetchLyrics = async (artist, songTitle) => {
    const data = await fetchData(`${api}/v1/${artist}/${songTitle}`)

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    songsContainer.innerHTML = `
        <li>
            <h2 class="song-artist"><strong>${artist}</strong> - ${songTitle}</h2>
            <p class="lyrics">${lyrics}</p>
        </li>
    `

}

const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
    insertSongsIntoPage(data)
}


const insertSongsIntoPage = songsInfo => {
    console.log(songsInfo)
    const lis = songsInfo.data.map(song =>
    `<li class="song">
        <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `)
    .reduce((accumulator, li)  => accumulator += li , '')

    songsContainer.innerHTML = lis

    if (songsInfo.prev || songsInfo.next) {
        prevAndNextContainer.innerHTML = `
            ${ songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : '' }
            ${ songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : '' }
        `
        return
    }

    prevAndNextContainer.innerHTML = ''
}   


// Events Listeners //

form.addEventListener('submit', event => {
    event.preventDefault()

    const searchValue = searchInput.value.trim()

    if (!searchValue) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido.</li>`
        return
    } 
    
    fetchSongs(searchValue) 
    console.log(searchValue)
})


songsContainer.addEventListener('click', event => {
    const clickedElement = event.target
    
    if(clickedElement.tagName === "BUTTON") {
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')


        prevAndNextContainer.innerHTML = ''
        fetchLyrics(artist, songTitle)
    }
})
